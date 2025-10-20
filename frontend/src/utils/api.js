import axios from 'axios';

const API_BASE = "http://localhost:5000";

// Matches backend route /api/weather
export const getWeather = (location) => axios.get(`${API_BASE}/api/weather`);

// Matches backend route /api/crop-suggestions
export const getCropSuggestions = (data) => axios.post(`${API_BASE}/api/crop-suggestions`, data);

// Matches backend route /api/predict-pest
export const detectPest = (formData) => axios.post(`${API_BASE}/api/predict-pest`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// Matches backend route /api/mandi-prices
export const getMarketPrices = (crop_id) => axios.get(`${API_BASE}/api/mandi-prices`);

// Matches backend route /chat
export const askLLM = (data) => axios.post(`${API_BASE}/chat`, data);
