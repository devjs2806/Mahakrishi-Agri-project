import sqlite3

CROP_DB = "crop_recommendation.db"

conn = sqlite3.connect(CROP_DB)
c = conn.cursor()

# Clear old data (optional, prevents duplicates)
c.execute("DELETE FROM crop_recommendations")

# ✅ Multiple crops for each soil + season + region
crop_data = [
    # ---------------- Vidarbha ----------------
    ("Alluvial", "Kharif", "Vidarbha", "Rice"),
    ("Alluvial", "Kharif", "Vidarbha", "Soybean"),
    ("Alluvial", "Kharif", "Vidarbha", "Cotton"),
    ("Alluvial", "Rabi", "Vidarbha", "Wheat"),
    ("Alluvial", "Rabi", "Vidarbha", "Gram"),
    ("Alluvial", "Zaid", "Vidarbha", "Maize"),
    ("Alluvial", "Zaid", "Vidarbha", "Vegetables"),

    ("Black", "Kharif", "Vidarbha", "Soybean"),
    ("Black", "Kharif", "Vidarbha", "Cotton"),
    ("Black", "Rabi", "Vidarbha", "Chickpea"),
    ("Black", "Rabi", "Vidarbha", "Wheat"),

    # ---------------- Marathwada ----------------
    ("Black", "Kharif", "Marathwada", "Cotton"),
    ("Black", "Kharif", "Marathwada", "Soybean"),
    ("Black", "Rabi", "Marathwada", "Chickpea"),
    ("Black", "Rabi", "Marathwada", "Wheat"),
    ("Black", "Zaid", "Marathwada", "Sunflower"),
    ("Black", "Zaid", "Marathwada", "Vegetables"),

    ("Alluvial", "Kharif", "Marathwada", "Rice"),
    ("Alluvial", "Kharif", "Marathwada", "Maize"),
    ("Alluvial", "Rabi", "Marathwada", "Onion"),
    ("Alluvial", "Rabi", "Marathwada", "Mustard"),

    # ---------------- Western Maharashtra ----------------
    ("Alluvial", "Kharif", "Western Maharashtra", "Soybean"),
    ("Alluvial", "Kharif", "Western Maharashtra", "Sugarcane"),
    ("Alluvial", "Rabi", "Western Maharashtra", "Wheat"),
    ("Alluvial", "Rabi", "Western Maharashtra", "Onion"),
    ("Alluvial", "Zaid", "Western Maharashtra", "Vegetables"),
    ("Alluvial", "Zaid", "Western Maharashtra", "Maize"),

    ("Black", "Kharif", "Western Maharashtra", "Cotton"),
    ("Black", "Kharif", "Western Maharashtra", "Soybean"),
    ("Black", "Rabi", "Western Maharashtra", "Chickpea"),
    ("Black", "Rabi", "Western Maharashtra", "Wheat"),

    # ---------------- Konkan ----------------
    ("Red", "Kharif", "Konkan", "Rice"),
    ("Red", "Kharif", "Konkan", "Turmeric"),
    ("Red", "Kharif", "Konkan", "Vegetables"),
    ("Red", "Rabi", "Konkan", "Onion"),
    ("Red", "Rabi", "Konkan", "Groundnut"),

    ("Laterite", "Kharif", "Konkan", "Rice"),
    ("Laterite", "Kharif", "Konkan", "Cashew"),
    ("Laterite", "Kharif", "Konkan", "Coconut"),
    ("Laterite", "Rabi", "Konkan", "Groundnut"),
    ("Laterite", "Rabi", "Konkan", "Horsegram"),
]

# Insert into database
c.executemany(
    "INSERT INTO crop_recommendations (soil_type, season, region, crop) VALUES (?, ?, ?, ?)",
    crop_data
)

conn.commit()
conn.close()
print("✅ Crop recommendations populated successfully with multiple crops per region!")
