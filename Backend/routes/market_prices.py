from flask import Blueprint, jsonify, request
from models import MarketPrices
from sqlalchemy import and_
from datetime import datetime, timedelta
import random
import requests

market_bp = Blueprint('market_prices', __name__, url_prefix='/market')

# 🌾 Agmarknet API Config
API_KEY = "579b464db66ec23bdd00000117b5d4d9cb1545477e2ceb23a66543cb"
RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070"
BASE_URL = f"https://api.data.gov.in/resource/{RESOURCE_ID}?api-key={API_KEY}&format=json&limit=1000"

@market_bp.route('/get', methods=['GET'])
def get_market_prices():
    crop_id = request.args.get('crop_id')
    region = request.args.get('region')

    # 🟢 Case 1: Crop + Region → Try Agmarknet API first
    if crop_id and region:
        try:
            api_url = f"{BASE_URL}&filters[commodity]={crop_id}&filters[market]={region}"
            res = requests.get(api_url, timeout=10)
            records = res.json().get("records", [])

            if records:
                # Sort latest to oldest
                records = sorted(records, key=lambda x: x.get("arrival_date", ""), reverse=True)[:7]
                historical = [
                    {
                        "date": r.get("arrival_date", ""),
                        "price": float(r.get("modal_price", 0))
                    }
                    for r in records
                ]
                # Simple prediction (avg + random)
                prices = [h["price"] for h in historical if h["price"] > 0]
                predicted = sum(prices) / len(prices) + random.randint(40, 120) if prices else 0
                return jsonify({
                    "crop": crop_id,
                    "region": region,
                    "historical": historical[::-1],  # reverse to oldest first
                    "predicted_price": round(predicted, 2)
                })
        except Exception as e:
            print(f"⚠️ Agmarknet API failed, falling back to DB: {e}")

        # 🛡️ Fallback to DB if API fails or no data
        prices = MarketPrices.query.filter(
            and_(MarketPrices.crop_id == crop_id, MarketPrices.mandi_name == region)
        ).order_by(MarketPrices.date.asc()).all()

        if not prices:
            # Generate dummy fallback data
            base_price = random.randint(2000, 6000)
            historical = [
                {
                    "date": (datetime.now() - timedelta(days=5 - i)).strftime("%Y-%m-%d"),
                    "price": base_price + random.randint(-100, 150)
                }
                for i in range(5)
            ]
            predicted = base_price + random.randint(50, 120)
            return jsonify({
                "crop": crop_id,
                "region": region,
                "historical": historical,
                "predicted_price": predicted
            })

        historical = [
            {"date": p.date.strftime("%Y-%m-%d"), "price": p.price}
            for p in prices
        ]
        last_prices = [p.price for p in prices[-5:]] if len(prices) >= 5 else [p.price for p in prices]
        predicted_price = sum(last_prices) / len(last_prices) + random.randint(40, 120)

        return jsonify({
            "crop": crop_id,
            "region": region,
            "historical": historical,
            "predicted_price": round(predicted_price, 2)
        })

    # 🟡 Case 2: No crop_id or region → Return latest DB entries for table
    all_prices = MarketPrices.query.order_by(MarketPrices.date.desc()).limit(50).all()
    table_data = [
        {
            "crop": p.crop_id,
            "mandi": p.mandi_name,
            "price": p.price,
            "date": p.date.strftime("%Y-%m-%d")
        }
        for p in all_prices
    ]
    return jsonify({"mandi_prices": table_data})
