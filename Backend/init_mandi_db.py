import sqlite3
import os

# Path for your database (same folder as app.py)
DB_PATH = os.path.join(os.path.dirname(__file__), "mandi_prices.db")

# Sample crop prices
SAMPLE_PRICES = [
    {"crop": "Wheat", "price": 2200, "unit": "quintal", "state": "Maharashtra"},
    {"crop": "Rice", "price": 3200, "unit": "quintal", "state": "Maharashtra"},
    {"crop": "Soybean", "price": 4500, "unit": "quintal", "state": "Maharashtra"},
    {"crop": "Maize", "price": 2800, "unit": "quintal", "state": "Maharashtra"},
    {"crop": "Cotton", "price": 6000, "unit": "quintal", "state": "Maharashtra"},
    {"crop": "Sugarcane", "price": 320, "unit": "quintal", "state": "Maharashtra"},
]

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # Create table if not exists
    c.execute("""
        CREATE TABLE IF NOT EXISTS mandi_prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crop TEXT NOT NULL,
            price REAL NOT NULL,
            unit TEXT DEFAULT 'quintal',
            state TEXT DEFAULT 'Maharashtra'
        )
    """)

    # Clear existing data (optional, for fresh start)
    c.execute("DELETE FROM mandi_prices")

    # Insert sample prices
    for p in SAMPLE_PRICES:
        c.execute("""
            INSERT INTO mandi_prices (crop, price, unit, state)
            VALUES (?, ?, ?, ?)
        """, (p["crop"], p["price"], p["unit"], p["state"]))

    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_PATH} with sample prices.")

if __name__ == "__main__":
    init_db()
