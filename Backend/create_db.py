import sqlite3

# Connect to SQLite database (it will create the file if not exists)
conn = sqlite3.connect("mandi_prices.db")
cursor = conn.cursor()

# Create table for mandi prices
cursor.execute("""
CREATE TABLE IF NOT EXISTS mandi_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crop_type TEXT NOT NULL,
    crop_variety TEXT,
    district TEXT,
    mandi_location TEXT,
    arrival_volume REAL,
    price REAL,
    demand_trend TEXT,
    season TEXT,
    sowing_period TEXT,
    harvesting_period TEXT,
    yield_estimate REAL,
    rainfall REAL,
    temperature REAL,
    soil_moisture_index REAL,
    event TEXT,
    government_msp REAL,
    procurement_level REAL,
    date TEXT NOT NULL
)
""")

print("Database and table created successfully!")

conn.commit()
conn.close()
