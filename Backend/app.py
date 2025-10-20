from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import logging
import sqlite3
import os
import requests

# ✅ Chatbot blueprint
from chat import llm_bp

# ✅ Crop Recommendation
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

# ✅ Pest Detection
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

# ===============================
# 🔑 API Keys
# ===============================
OPENWEATHER_API_KEY = "5644449e6f0f3e016b5722faff75c784"
AGMARKNET_API_KEY   = "579b464db66ec23bdd00000117b5d4d9cb1545477e2ceb23a66543cb"
NEWS_API_KEY        = "aa288bc1e1eb4f8893e2f79839c331fb"

# ===============================
# 📂 Database Paths
# ===============================
REGION_DB = os.path.join(os.path.dirname(__file__), "db", "maha_krishi.db")

if not os.path.exists(REGION_DB):
    logging.warning("⚠️ Region DB not found at %s — make sure to seed it first!", REGION_DB)

# ===============================
# 🌦 Weather API
# ===============================
@app.route("/api/weather", methods=["GET"])
def get_weather():
    city = request.args.get("city", "Pune")
    try:
        resp = requests.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={"q": f"{city},IN", "appid": OPENWEATHER_API_KEY, "units": "metric"},
            timeout=8
        )
        resp.raise_for_status()
        data = resp.json()
        return jsonify({
            "city": data.get("name", city),
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "condition": data["weather"][0]["description"],
            "wind_speed": data["wind"]["speed"]
        })
    except Exception as e:
        logging.error(f"Weather API error: {e}")
        return jsonify({"error": "Weather API failed"}), 502

# ===============================
# 🏛 Division - District - Market - Commodity - Prices
# ===============================
@app.route("/api/divisions", methods=["GET"])
def get_divisions():
    with sqlite3.connect(REGION_DB) as conn:
        c = conn.cursor()
        c.execute("SELECT id, name FROM divisions")
        divisions = [{"id": row[0], "name": row[1]} for row in c.fetchall()]
    return jsonify(divisions)

@app.route("/api/districts", methods=["GET"])
def get_districts():
    division_id = request.args.get("division_id")
    if not division_id:
        return jsonify({"error": "division_id is required"}), 400
    with sqlite3.connect(REGION_DB) as conn:
        c = conn.cursor()
        c.execute("SELECT id, name FROM districts WHERE division_id = ?", (division_id,))
        districts = [{"id": row[0], "name": row[1]} for row in c.fetchall()]
    return jsonify(districts)

@app.route("/api/markets", methods=["GET"])
def get_markets():
    district_id = request.args.get("district_id")
    if not district_id:
        return jsonify({"error": "district_id is required"}), 400
    with sqlite3.connect(REGION_DB) as conn:
        c = conn.cursor()
        c.execute("SELECT id, name FROM markets WHERE district_id = ?", (district_id,))
        markets = [{"id": row[0], "name": row[1]} for row in c.fetchall()]
    return jsonify(markets)

@app.route("/api/commodities", methods=["GET"])
def get_commodities():
    with sqlite3.connect(REGION_DB) as conn:
        c = conn.cursor()
        c.execute("SELECT id, name FROM commodities")
        commodities = [{"id": row[0], "name": row[1]} for row in c.fetchall()]
    return jsonify(commodities)

@app.route("/api/prices", methods=["GET"])
def get_prices():
    market_id = request.args.get("market_id")
    commodity_id = request.args.get("commodity_id")
    if not market_id or not commodity_id:
        return jsonify({"error": "market_id and commodity_id are required"}), 400

    with sqlite3.connect(REGION_DB) as conn:
        c = conn.cursor()
        c.execute("""
            SELECT date, min_price, max_price, modal_price 
            FROM market_prices 
            WHERE market_id = ? AND commodity_id = ?
            ORDER BY date ASC
        """, (market_id, commodity_id))
        prices = [
            {"date": row[0], "min_price": row[1], "max_price": row[2], "modal_price": row[3]}
            for row in c.fetchall()
        ]
    return jsonify(prices)

# ===============================
# 🧰 Market Price Proxy Route (Fix CORS)
# ===============================
@app.route("/api/market-data", methods=["GET"])
def proxy_market_data():
    try:
        url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
        params = {
            "api-key": AGMARKNET_API_KEY,
            "format": "json",
            "limit": 5000            # record selection
        }
        r = requests.get(url, params=params, timeout=40)
        r.raise_for_status()
        return jsonify(r.json())
    except Exception as e:
        logging.error(f"❌ Error proxying market data: {e}")
        return jsonify({"error": "Failed to fetch market data"}), 500

# ===============================
# 📰 Farmer News API
# ===============================
@app.route("/api/farmer-news", methods=["GET"])
def farmer_news():
    try:
        r = requests.get(
            "https://newsapi.org/v2/everything",
            params={
                "q": "farmer OR agriculture OR crop OR MSP",
                "language": "en",
                "sortBy": "publishedAt",
                "pageSize": 12,
                "apiKey": NEWS_API_KEY,
                "domains": "thehindu.com,timesofindia.indiatimes.com,indianexpress.com,business-standard.com"
            },
            timeout=10
        )
        data = r.json()
        articles = [
            {
                "title": a.get("title", ""),
                "description": a.get("description", ""),
                "url": a.get("url", ""),
                "source": a["source"]["name"]
            }
            for a in data.get("articles", [])
            if a.get("title")
        ]
        return jsonify({"news": articles})
    except Exception as e:
        logging.error(f"News fetch failed: {e}")
        return jsonify({"news": []})

# ===============================
# 🤖 Chatbot
# ===============================
app.register_blueprint(llm_bp)

# ===============================
# 🌱 Crop Recommendation
# ===============================
CSV_PATH = os.path.join(os.path.dirname(__file__), "data", "Crop_recommendation.csv")
df = pd.read_csv(CSV_PATH)

X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']

model = RandomForestClassifier()
model.fit(X, y)

@app.route("/api/recommend-crops", methods=["POST"])
def recommend_crops():
    try:
        data = request.get_json()
        values = [
            data.get("N"),
            data.get("P"),
            data.get("K"),
            data.get("temperature"),
            data.get("humidity"),
            data.get("ph"),
            data.get("rainfall")
        ]
        prediction = model.predict([values])[0]
        return jsonify({"recommended_crop": prediction})
    except Exception as e:
        logging.error(f"❌ Crop recommendation error: {e}")
        return jsonify({"error": "Prediction failed"}), 500

# ===============================
# 🪲 Pest Detection
# ===============================
model_general = YOLO("models/pest_best.pt")

@app.route("/api/pest-detect", methods=["POST"])
def pest_detect():
    file = request.files.get("image")
    if not file:
        return jsonify({"error": "No image uploaded"}), 400

    os.makedirs("tmp", exist_ok=True)
    image_path = os.path.join("tmp", file.filename)
    file.save(image_path)

    try:
        results = model_general.predict(image_path, conf=0.25)
        detections = []
        for box in results[0].boxes:
            detections.append({
                "class": results[0].names[int(box.cls)],
                "confidence": round(float(box.conf), 2)
            })
        return jsonify({"detections": detections})
    except Exception as e:
        logging.error(f"Pest detection failed: {e}")
        return jsonify({"error": "Detection failed"}), 500

# ===============================
# 🏡 Default Route
# ===============================
@app.route("/")
def home():
    return jsonify({"message": "✅ MahaKrishi Backend is running 🚜"})

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Route not found"}), 404

# ===============================
# 🚀 Run Server
# ===============================
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
