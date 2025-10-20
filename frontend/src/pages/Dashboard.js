import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

export default function Dashboard() {
  // 🌱 Static metadata (can be stored in DB later)
  const divisionMeta = useMemo(
    () => ({
      Konkan: {
        soil: ["Laterite", "Red soil", "Coastal alluvium"],
        rainfall_mm: "2500–3500",
      },
      Pune: {
        soil: ["Black cotton (Regur)", "Loamy"],
        rainfall_mm: "600–1200",
      },
      Nashik: {
        soil: ["Black soil", "Alluvial (riverine)"],
        rainfall_mm: "700–1200",
      },
      Aurangabad: {
        soil: ["Black cotton", "Calcareous"],
        rainfall_mm: "600–900",
      },
      Amravati: {
        soil: ["Deep black", "Medium black"],
        rainfall_mm: "800–1100",
      },
      Nagpur: {
        soil: ["Black", "Sandy loam (in pockets)"],
        rainfall_mm: "1000–1200",
      },
    }),
    []
  );

  // 📍 Divisions & Districts (static for now)
  const [divisions] = useState([
    {
      name: "Konkan",
      districts: [
        "Thane",
        "Raigad",
        "Mumbai City",
        "Mumbai Suburban",
        "Palghar",
        "Ratnagiri",
        "Sindhudurg",
      ],
    },
    {
      name: "Pune",
      districts: ["Pune", "Solapur", "Satara", "Sangli", "Kolhapur"],
    },
    {
      name: "Nashik",
      districts: ["Nashik", "Ahmednagar", "Dhule", "Jalgaon", "Nandurbar"],
    },
    {
      name: "Aurangabad",
      districts: ["Aurangabad", "Beed", "Jalna", "Osmanabad"],
    },
    {
      name: "Amravati",
      districts: ["Amravati", "Akola", "Buldhana", "Washim", "Yavatmal"],
    },
    {
      name: "Nagpur",
      districts: [
        "Nagpur",
        "Bhandara",
        "Chandrapur",
        "Gadchiroli",
        "Gondia",
        "Wardha",
      ],
    },
  ]);

  // 🧠 UI State
  const [selectedDivision, setSelectedDivision] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [weather, setWeather] = useState(null);
  const [recommendedCrops, setRecommendedCrops] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [errorWeather, setErrorWeather] = useState(null);

  // 🔄 Division Change → Update Districts
  const handleDivisionChange = (divisionName) => {
    setSelectedDivision(divisionName);
    const division = divisions.find((d) => d.name === divisionName);
    setDistricts(division ? division.districts : []);
    setSelectedDistrict("");
    setWeather(null);
    setRecommendedCrops([]);
    setErrorWeather(null);
  };

  // 🌦 Fetch weather when district changes
  useEffect(() => {
    if (!selectedDistrict) return;
    const fetchWeather = async () => {
      setLoadingWeather(true);
      setErrorWeather(null);
      setWeather(null);
      try {
        const res = await axios.get(
          `http://127.0.0.1:5000/api/weather?city=${encodeURIComponent(
            selectedDistrict
          )}`
        );
        if (res.data?.error) {
          setErrorWeather(res.data.error || "Weather API failed");
        } else {
          setWeather(res.data);
        }
      } catch (err) {
        setErrorWeather("Failed to fetch weather. Please try again.");
        console.error("Weather error:", err);
      } finally {
        setLoadingWeather(false);
      }
    };
    fetchWeather();
  }, [selectedDistrict]);

  // 🌾 Recommended crops (placeholder)
  useEffect(() => {
    if (!selectedDistrict) return;
    const sampleCrops = {
      Thane: ["Rice", "Banana", "Vegetables"],
      Raigad: ["Rice", "Coconut", "Arecanut"],
      Pune: ["Sugarcane", "Wheat", "Onion"],
      Nagpur: ["Soybean", "Cotton", "Turmeric"],
      Nashik: ["Grapes", "Onion", "Wheat"],
    };
    setRecommendedCrops(
      sampleCrops[selectedDistrict] || ["(Will load from CSV/DB)"]
    );
  }, [selectedDistrict]);

  const meta = selectedDivision ? divisionMeta[selectedDivision] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-10 px-6">
      {/* 🏡 Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-green-800 drop-shadow-sm">
          🌿 Maharashtra Agri Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Select your division and district to get local insights.
        </p>
      </div>

      {/* 📍 Division & District Dropdowns */}
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-5xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 border">
        {/* Division */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-2">
            Select Division
          </label>
          <select
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={selectedDivision}
            onChange={(e) => handleDivisionChange(e.target.value)}
          >
            <option value="">-- Select Division --</option>
            {divisions.map((div, idx) => (
              <option key={idx} value={div.name}>
                {div.name}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-2">
            Select District
          </label>
          <select
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-100"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedDivision}
          >
            <option value="">-- Select District --</option>
            {districts.map((dist, idx) => (
              <option key={idx} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        {/* Division Snapshot */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-2">
            Division Snapshot
          </label>
          <div className="border rounded-lg p-3 bg-gray-50 h-full">
            {meta ? (
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-semibold">Soils:</span>{" "}
                  {meta.soil.join(", ")}
                </p>
                <p>
                  <span className="font-semibold">Rainfall:</span>{" "}
                  {meta.rainfall_mm} mm
                </p>
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">
                Select a division to view soil & rainfall
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 🌦 Weather & 🌾 Crops Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Weather Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-green-800">
              🌦 Current Weather
            </h2>
            {selectedDistrict && (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                {selectedDistrict}
              </span>
            )}
          </div>

          {!selectedDistrict && (
            <p className="text-gray-500 italic mt-3">
              Select a district to view weather data.
            </p>
          )}
          {selectedDistrict && loadingWeather && (
            <p className="text-gray-600 mt-3">Fetching weather…</p>
          )}
          {selectedDistrict && errorWeather && (
            <p className="text-red-600 mt-3">{errorWeather}</p>
          )}
          {selectedDistrict && weather && !errorWeather && (
            <div className="text-gray-700 space-y-2 mt-4">
              <p>
                <strong>📍 City:</strong> {weather.city}
              </p>
              <p>
                <strong>🌡 Temperature:</strong> {weather.temperature} °C
              </p>
              <p>
                <strong>💧 Humidity:</strong> {weather.humidity}%
              </p>
              <p>
                <strong>☁ Condition:</strong> {weather.condition}
              </p>
              <p>
                <strong>🌬 Wind Speed:</strong> {weather.wind_speed} m/s
              </p>
            </div>
          )}
        </div>

        {/* Crops Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border">
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            🌾 Recommended Crops
          </h2>
          {!selectedDistrict ? (
            <p className="text-gray-500 italic">
              Select a district to view recommended crops.
            </p>
          ) : recommendedCrops.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
              {recommendedCrops.map((crop, idx) => (
                <li key={idx}>{crop}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">
              No crop info available for this district.
            </p>
          )}
          <div className="mt-4 text-xs text-gray-500">
            (This list is a placeholder — wire to CSV/DB when ready)
          </div>
        </div>
      </div>
    </div>
  );
}
