import sqlite3
from datetime import datetime

# Database path
DB_PATH = "db/maha_krishi.db"
SCHEMA_PATH = "models/schema.sql"

# 📍 Divisions and Districts
DIVISIONS = {
    "Konkan": ["Thane", "Raigad", "Mumbai City", "Mumbai Suburban", "Palghar", "Ratnagiri", "Sindhudurg"],
    "Pune": ["Pune", "Solapur", "Satara", "Sangli", "Kolhapur"],
    "Nashik": ["Nashik", "Ahmednagar", "Dhule", "Jalgaon", "Nandurbar"],
    "Aurangabad": ["Aurangabad", "Beed", "Jalna", "Osmanabad"],
    "Amravati": ["Amravati", "Akola", "Buldhana", "Washim", "Yavatmal"],
    "Nagpur": ["Nagpur", "Bhandara", "Chandrapur", "Gadchiroli", "Gondia", "Wardha"]
}

# 🌾 Commodities (general list)
COMMODITIES = ["Rice", "Banana", "Onion", "Tomato", "Wheat", "Cotton", "Sugarcane", "Soybean", "Grapes"]

# 🏪 Markets: We'll create one market per district (e.g., "Thane Mandi")
def create_market_name(district):
    return f"{district} Mandi"

# 💰 Sample prices
def generate_sample_prices():
    import random
    min_price = random.randint(1500, 3000)
    max_price = min_price + random.randint(300, 800)
    modal_price = (min_price + max_price) // 2
    return min_price, max_price, modal_price

# 🧰 Initialize DB
def init_db():
    conn = sqlite3.connect(DB_PATH)
    with open(SCHEMA_PATH, "r") as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()
    print("✅ Database schema created.")

# 🌿 Seed Data
def seed_data():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # Insert Divisions & Districts
    for division, districts in DIVISIONS.items():
        c.execute("INSERT INTO divisions (name) VALUES (?)", (division,))
        division_id = c.lastrowid

        for district in districts:
            c.execute("INSERT INTO districts (name, division_id) VALUES (?, ?)", (district, division_id))
            district_id = c.lastrowid

            # Create a market for each district
            market_name = create_market_name(district)
            c.execute("INSERT INTO markets (name, district_id) VALUES (?, ?)", (market_name, district_id))

    # Insert Commodities
    for commodity in COMMODITIES:
        c.execute("INSERT INTO commodities (name) VALUES (?)", (commodity,))

    conn.commit()

    # Seed Market Prices
    c.execute("SELECT id FROM markets")
    market_ids = [row[0] for row in c.fetchall()]
    c.execute("SELECT id FROM commodities")
    commodity_ids = [row[0] for row in c.fetchall()]

    today = datetime.now().strftime("%Y-%m-%d")

    for market_id in market_ids:
        for commodity_id in commodity_ids[:5]:  # only first 5 commodities per market
            min_p, max_p, modal_p = generate_sample_prices()
            c.execute("""
                INSERT INTO market_prices (market_id, commodity_id, date, min_price, max_price, modal_price)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (market_id, commodity_id, today, min_p, max_p, modal_p))

    conn.commit()
    conn.close()
    print("✅ Data seeded successfully.")

if __name__ == "__main__":
    init_db()
    seed_data()
