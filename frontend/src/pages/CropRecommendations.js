import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function CropRecommendation() {
  const [N, setN] = useState("");
  const [P, setP] = useState("");
  const [K, setK] = useState("");
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [ph, setPh] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [recommendedCrop, setRecommendedCrop] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateOptions = (start, end, step = 5) => {
    const options = [];
    for (let i = start; i <= end; i += step) {
      options.push(i);
    }
    return options;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRecommendedCrop(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/recommend-crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          N: Number(N),
          P: Number(P),
          K: Number(K),
          temperature: Number(temperature),
          humidity: Number(humidity),
          ph: Number(ph),
          rainfall: Number(rainfall),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      setRecommendedCrop(data.recommended_crop || null);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendedCrop(null);
    } finally {
      setLoading(false);
    }
  };

  const chartData = recommendedCrop ? [{ crop: recommendedCrop, score: 1 }] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-10 px-4 flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-10 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 tracking-tight drop-shadow-sm">
          🌿 Crop Recommendation System
        </h1>
        <p className="mt-3 text-gray-700 text-lg">
          Enter or select soil and weather values to get recommended crops.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-3xl border border-gray-200">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Nitrogen */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">N (Nitrogen)</label>
            <select
              value={N}
              onChange={(e) => setN(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select N value</option>
              {generateOptions(0, 140, 5).map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>

          {/* Phosphorus */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">P (Phosphorus)</label>
            <select
              value={P}
              onChange={(e) => setP(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select P value</option>
              {generateOptions(5, 145, 5).map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>

          {/* Potassium */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">K (Potassium)</label>
            <select
              value={K}
              onChange={(e) => setK(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select K value</option>
              {generateOptions(5, 205, 5).map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>

          {/* Temperature */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Temperature (°C)
            </label>
            <input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Humidity */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Humidity (%)</label>
            <input
              type="number"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* pH */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">pH Level</label>
            <input
              type="number"
              step="0.1"
              value={ph}
              onChange={(e) => setPh(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Rainfall */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Rainfall (mm)</label>
            <input
              type="number"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="sm:col-span-2 text-center mt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Predicting..." : "Get Recommendation"}
            </button>
          </div>
        </form>
      </div>

      {/* Output Section */}
      <div className="mt-10 w-full max-w-3xl text-center">
        {recommendedCrop ? (
          <>
            <h2 className="text-2xl font-bold text-green-800 mb-3">
              ✅ Recommended Crop:{" "}
              <span className="text-3xl text-emerald-600">{recommendedCrop}</span>
            </h2>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                📊 Visualization
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="crop" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p className="text-gray-600 text-lg">
            Select or enter the values above and click “Get Recommendation” to see your result.
          </p>
        )}
      </div>
    </div>
  );
}
