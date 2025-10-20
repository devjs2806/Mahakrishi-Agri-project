import sqlite3
from datetime import date

conn = sqlite3.connect("mandi_prices.db")
cursor = conn.cursor()

# Sample data
data = [
    ("Wheat", "Sharbati", "Nagpur", "Nagpur Mandi", 120.5, 2200, "High local demand", "Rabi", "Nov-Dec", "Mar-Apr", 24.5, 75, 30.5, 0.65, "No drought", 2100, 5000, str(date.today())),
    ("Rice", "Basmati", "Pune", "Pune Mandi", 90, 3200, "High export demand", "Kharif", "Jun-Jul", "Oct-Nov", 30.0, 120, 32.0, 0.7, "Flood", 3000, 4000, str(date.today()))
]

cursor.executemany("""
INSERT INTO mandi_prices (
    crop_type, crop_variety, district, mandi_location, arrival_volume,
    price, demand_trend, season, sowing_period, harvesting_period,
    yield_estimate, rainfall, temperature, soil_moisture_index, event,
    government_msp, procurement_level, date
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", data)

conn.commit()
conn.close()
print("Dummy data inserted successfully!")
