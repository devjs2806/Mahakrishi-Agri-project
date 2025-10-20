import sqlite3

# Connect (this will create the DB file if it doesn't exist)
conn = sqlite3.connect("crop_recommendation.db")
c = conn.cursor()

# Drop table if exists (for reset purpose, optional)
c.execute("DROP TABLE IF EXISTS crop_recommendations")

# Create table with soil, season, region
c.execute("""
CREATE TABLE crop_recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    soil_type TEXT NOT NULL,
    season TEXT NOT NULL,
    region TEXT NOT NULL,
    crop TEXT NOT NULL
)
""")

# Sample soil types in Maharashtra
soils = [
    "Black soil", "Red soil", "Laterite soil",
    "Alluvial soil", "Sandy soil", "Clayey soil"
]

# Seasons
seasons = ["Kharif", "Rabi", "Zaid"]

# Regions in Maharashtra
regions = [
    "Vidarbha", "Marathwada", "Konkan", "Western Maharashtra",
    "North Maharashtra"
]

# Example crops (dummy dataset for now)
sample_data = [
    ("Black soil", "Kharif", "Vidarbha", "Cotton"),
    ("Black soil", "Rabi", "Marathwada", "Wheat"),
    ("Red soil", "Kharif", "Konkan", "Rice"),
    ("Laterite soil", "Kharif", "Konkan", "Cashew"),
    ("Alluvial soil", "Rabi", "North Maharashtra", "Sugarcane"),
    ("Sandy soil", "Zaid", "Western Maharashtra", "Groundnut"),
    ("Clayey soil", "Rabi", "Marathwada", "Gram"),
    ("Black soil", "Kharif", "Vidarbha", "Soybean"),
    ("Red soil", "Rabi", "North Maharashtra", "Onion"),
    ("Alluvial soil", "Kharif", "Western Maharashtra", "Maize"),
]

# Insert sample rows
c.executemany("""
INSERT INTO crop_recommendations (soil_type, season, region, crop)
VALUES (?, ?, ?, ?)
""", sample_data)

conn.commit()
conn.close()

print("✅ crop_recommendation.db created with sample data!")
