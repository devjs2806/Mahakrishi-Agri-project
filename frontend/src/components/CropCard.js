import React from "react";

export default function CropCard({ crop }) {
  if (!crop) return null;

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-200 p-6 transition-all duration-300 transform hover:-translate-y-2 w-full max-w-sm mx-auto"
    >
      {/* Optional Crop Image */}
      {crop.image && (
        <div className="w-full h-40 mb-4 overflow-hidden rounded-xl">
          <img
            src={crop.image}
            alt={crop.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Crop Name */}
      <h3 className="text-2xl font-bold text-green-800 mb-2 tracking-tight">
        🌱 {crop.name}
      </h3>

      {/* Crop Details */}
      <div className="text-gray-700 space-y-1 text-sm">
        <p>
          <span className="font-semibold text-gray-800">🌤 Season:</span>{" "}
          {crop.season}
        </p>
        <p>
          <span className="font-semibold text-gray-800">🌱 Soil Type:</span>{" "}
          {crop.soil_type}
        </p>
        <p>
          <span className="font-semibold text-gray-800">📍 Region:</span>{" "}
          {crop.region}
        </p>
        <p>
          <span className="font-semibold text-gray-800">📊 Expected Yield:</span>{" "}
          {crop.expected_yield} quintals/hectare
        </p>
      </div>

      {/* Action Buttons (Optional) */}
      <div className="mt-4 flex gap-3 justify-center">
        <button
          className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-green-700 transition-all duration-200"
        >
          View Details
        </button>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-all duration-200"
        >
          Compare
        </button>
      </div>
    </div>
  );
}
