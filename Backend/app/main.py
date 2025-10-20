from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# --------------------------
# FastAPI App
# --------------------------
app = FastAPI(title="MahaKrishi Backend")

# --------------------------
# CORS: Allow React frontend
# --------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------
# Pydantic Models
# --------------------------
class CropSuggestionRequest(BaseModel):
    soil_type: str
    season: str

class FertilizerRequest(BaseModel):
    crop: str

# --------------------------
# API Endpoints
# --------------------------

# 1️⃣ Mandi Prices
@app.get("/api/mandi-prices")
async def get_mandi_prices():
    return {
        "mandi_prices": [
            {"crop": "Wheat", "price": 2000, "unit": "kg", "market": "Pune"},
            {"crop": "Rice", "price": 2200, "unit": "kg", "market": "Mumbai"},
            {"crop": "Maize", "price": 1800, "unit": "kg", "market": "Nagpur"},
        ]
    }

# 2️⃣ Weather
@app.get("/api/weather")
async def get_weather():
    return {
        "location": "Pune, Maharashtra",
        "forecast": [
            {"day": "Monday", "temp": 30, "condition": "Sunny"},
            {"day": "Tuesday", "temp": 28, "condition": "Cloudy"},
            {"day": "Wednesday", "temp": 29, "condition": "Rainy"},
        ]
    }

# 3️⃣ Crop Suggestions
@app.post("/api/crop-suggestions")
async def get_crop_suggestions(request: CropSuggestionRequest):
    suggestions_map = {
        "Alluvial": {"Kharif": ["Rice", "Maize"], "Rabi": ["Wheat", "Barley"]},
        "Black": {"Kharif": ["Cotton", "Soybean"], "Rabi": ["Wheat", "Gram"]},
        "Red": {"Kharif": ["Millets", "Rice"], "Rabi": ["Wheat", "Pulses"]},
    }
    crops = suggestions_map.get(request.soil_type, {}).get(request.season, ["No suggestions"])
    return {"suggestions": crops}

# 4️⃣ Fertilizer Recommendation
@app.post("/api/fertilizer-recommendation")
async def get_fertilizer(request: FertilizerRequest):
    fertilizers_map = {
        "Wheat": ["Urea", "DAP"],
        "Rice": ["NPK", "Ammonium Sulphate"],
        "Cotton": ["Potash", "Nitrogen"],
        "Maize": ["Urea", "Super Phosphate"]
    }
    recommended = fertilizers_map.get(request.crop, ["No recommendation"])
    return {"recommended_fertilizers": recommended}
