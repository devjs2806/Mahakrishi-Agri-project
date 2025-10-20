USE mahakrishi;

-- ---------------------------
-- Sample Farmers
-- ---------------------------
INSERT INTO farmers (name, location, language, soil_type, farm_size)
VALUES 
('Ramesh Patil', 'Pune', 'marathi', 'black', 2.5),
('Suresh Kumar', 'Nagpur', 'hindi', 'red', 1.8),
('Anjali Deshmukh', 'Mumbai', 'english', 'alluvial', 3.0);

-- ---------------------------
-- Sample Crops
-- ---------------------------
INSERT INTO crops (name, season, soil_type, region, expected_yield)
VALUES 
('Wheat', 'Rabi', 'alluvial', 'Pune', 2.0),
('Rice', 'Kharif', 'clay', 'Nagpur', 3.5),
('Sugarcane', 'Kharif', 'black', 'Pune', 4.0);

-- ---------------------------
-- Sample Pest/Diseases
-- ---------------------------
INSERT INTO pest_diseases (crop_id, disease_name, treatment, image_path)
VALUES 
(1, 'Rust', 'Apply fungicide', NULL),
(2, 'Leaf Blight', 'Spray neem oil', NULL),
(3, 'Top Shoot Borer', 'Use pheromone traps', NULL);

-- ---------------------------
-- Sample Market Prices
-- ---------------------------
INSERT INTO market_prices (crop_id, mandi_name, date, price)
VALUES 
(1, 'Pune Mandi', '2025-09-28', 2200),
(2, 'Nagpur Mandi', '2025-09-28', 3500),
(3, 'Pune Mandi', '2025-09-28', 1800);

-- ---------------------------
-- Sample User History
-- ---------------------------
INSERT INTO user_history (farmer_id, query)
VALUES 
(1, 'Which crop is suitable for black soil in Kharif season?'),
(2, 'Show market price for Rice in Nagpur'),
(3, 'Detect disease from leaf image');
