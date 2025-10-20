from flask import Blueprint, jsonify, request
import requests

# Blueprint for Agmarknet API
agmark_bp = Blueprint('agmarknet', __name__, url_prefix='/agmark')

# ✅ Your Agmarknet API Key
API_KEY = "579b464db66ec23bdd00000117b5d4d9cb1545477e2ceb23a66543cb"
RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070"
BASE_URL = f"https://api.data.gov.in/resource/{RESOURCE_ID}?api-key={API_KEY}&format=json&limit=1000"

# ✅ Get all available crops
@agmark_bp.route('/crops', methods=['GET'])
def get_crops():
    try:
        res = requests.get(BASE_URL, timeout=10)
        data = res.json().get("records", [])
        crops = sorted(set(item["commodity"] for item in data if item.get("commodity")))
        return jsonify(crops)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Get all available markets
@agmark_bp.route('/markets', methods=['GET'])
def get_markets():
    try:
        res = requests.get(BASE_URL, timeout=10)
        data = res.json().get("records", [])
        markets = sorted(set(item["market"] for item in data if item.get("market")))
        return jsonify(markets)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Get price data for a specific crop and market
@agmark_bp.route('/price', methods=['GET'])
def get_price():
    crop = request.args.get("crop")
    market = request.args.get("market")
    if not crop or not market:
        return jsonify({"error": "crop and market are required"}), 400

    try:
        url = f"{BASE_URL}&filters[commodity]={crop}&filters[market]={market}"
        res = requests.get(url, timeout=10)
        data = res.json().get("records", [])

        # Sort latest first (based on arrival_date)
        data = sorted(data, key=lambda x: x.get("arrival_date", ""), reverse=True)

        # Limit to last 7 entries for graph
        data = data[:7]

        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
