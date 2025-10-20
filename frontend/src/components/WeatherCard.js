import React, { useState } from "react";
import { FaCloudSun, FaSearch } from "react-icons/fa";

export default function Weather() {
  const [city, setCity] = useState("Pune");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(`http://localhost:5000/api/weather?city=${city}`);
      if (!response.ok) throw new Error("Weather fetch failed");
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("⚠️ Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") fetchWeather();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <FaCloudSun className="text-4xl text-green-600 mr-2" />
        <h2 className="text-2xl font-bold text-green-800">Weather Info</h2>
      </div>

      {/* Input Section */}
      <div className="flex mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter city name"
          className="flex-grow px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
        <button
          onClick={fetchWeather}
          disabled={loading}
          className={`px-4 py-2 flex items-center gap-2 rounded-r-lg transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          <FaSearch />
          Search
        </button>
      </div>

      {/* Weather Result */}
      {loading && (
        <p className="text-gray-500 text-center animate-pulse">🌱 Fetching weather...</p>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {weather && (
        <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200 shadow-sm">
          <h3 className="text-xl font-bold text-green-800 mb-2">{weather.city}</h3>
          <div className="text-gray-800 space-y-1">
            <p>🌡 <strong>Temperature:</strong> {weather.temperature} °C</p>
            <p>💧 <strong>Humidity:</strong> {weather.humidity}%</p>
            <p>☁ <strong>Condition:</strong> {weather.condition}</p>
            <p>🌬 <strong>Wind Speed:</strong> {weather.wind_speed} m/s</p>
          </div>
        </div>
      )}

      {!loading && !weather && !error && (
        <p className="text-gray-500 text-center mt-4">No data yet 🌾</p>
      )}
    </div>
  );
}
