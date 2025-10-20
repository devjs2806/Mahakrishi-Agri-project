# Backend/models.py
from extensions import db

# ---------------------------
# Farmers Table
# ---------------------------
class Farmers(db.Model):
    __tablename__ = 'farmers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    language = db.Column(db.Enum('english', 'hindi', 'marathi'), nullable=False)
    soil_type = db.Column(db.String(50), nullable=False)
    farm_size = db.Column(db.Float, nullable=True)

    history = db.relationship('UserHistory', backref='farmer', lazy=True)

# ---------------------------
# Crops Table
# ---------------------------
class Crops(db.Model):
    __tablename__ = 'crops'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    season = db.Column(db.String(20), nullable=False)  # Kharif / Rabi
    soil_type = db.Column(db.String(50), nullable=False)
    region = db.Column(db.String(50), nullable=False)
    expected_yield = db.Column(db.Float, nullable=True)

    pests = db.relationship('PestDiseases', backref='crop', lazy=True)
    market_prices = db.relationship('MarketPrices', backref='crop', lazy=True)

# ---------------------------
# Pest/Disease Table
# ---------------------------
class PestDiseases(db.Model):
    __tablename__ = 'pest_diseases'
    
    id = db.Column(db.Integer, primary_key=True)
    crop_id = db.Column(db.Integer, db.ForeignKey('crops.id'), nullable=False)
    disease_name = db.Column(db.String(100), nullable=False)
    treatment = db.Column(db.Text, nullable=False)
    image_path = db.Column(db.String(255), nullable=True)

# ---------------------------
# Market Prices Table
# ---------------------------
class MarketPrices(db.Model):
    __tablename__ = 'market_prices'
    
    id = db.Column(db.Integer, primary_key=True)
    crop_id = db.Column(db.Integer, db.ForeignKey('crops.id'), nullable=False)
    mandi_name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    price = db.Column(db.Float, nullable=False)

# ---------------------------
# User History Table
# ---------------------------
class UserHistory(db.Model):
    __tablename__ = 'user_history'
    
    id = db.Column(db.Integer, primary_key=True)
    farmer_id = db.Column(db.Integer, db.ForeignKey('farmers.id'), nullable=False)
    query = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, server_default=db.func.current_timestamp())
