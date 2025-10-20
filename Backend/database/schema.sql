-- Database: mahakrishi
CREATE DATABASE IF NOT EXISTS mahakrishi;
USE mahakrishi;

-- ---------------------------
-- Farmers Table
-- ---------------------------
CREATE TABLE IF NOT EXISTS farmers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    language ENUM('english','hindi','marathi') NOT NULL,
    soil_type VARCHAR(50) NOT NULL,
    farm_size FLOAT
);

-- ---------------------------
-- Crops Table
-- ---------------------------
CREATE TABLE IF NOT EXISTS crops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    season VARCHAR(20) NOT NULL, -- Kharif / Rabi
    soil_type VARCHAR(50) NOT NULL,
    region VARCHAR(50) NOT NULL,
    expected_yield FLOAT
);

-- ---------------------------
-- Pest/Disease Table
-- ---------------------------
CREATE TABLE IF NOT EXISTS pest_diseases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crop_id INT NOT NULL,
    disease_name VARCHAR(100) NOT NULL,
    treatment TEXT NOT NULL,
    image_path VARCHAR(255),
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE
);

-- ---------------------------
-- Market Prices Table
-- ---------------------------
CREATE TABLE IF NOT EXISTS market_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crop_id INT NOT NULL,
    mandi_name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    price FLOAT NOT NULL,
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE
);

-- ---------------------------
-- User History Table
-- ---------------------------
CREATE TABLE IF NOT EXISTS user_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    query TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
);
