CREATE TABLE divisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE districts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    division_id INTEGER,
    FOREIGN KEY (division_id) REFERENCES divisions(id)
);

CREATE TABLE markets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    district_id INTEGER,
    FOREIGN KEY (district_id) REFERENCES districts(id)
);

CREATE TABLE commodities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE market_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    market_id INTEGER,
    commodity_id INTEGER,
    date TEXT,
    min_price REAL,
    max_price REAL,
    modal_price REAL,
    FOREIGN KEY (market_id) REFERENCES markets(id),
    FOREIGN KEY (commodity_id) REFERENCES commodities(id)
);

CREATE TABLE crop_recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    district_id INTEGER,
    soil_type TEXT,
    season TEXT,
    recommended_crop TEXT,
    FOREIGN KEY (district_id) REFERENCES districts(id)
);
