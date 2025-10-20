import React, { useState } from "react";
import { detectPest } from "../utils/api";
import { FaBug, FaUpload } from "react-icons/fa";

export default function PestDetectionModal() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("⚠️ Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await detectPest(formData);
      setResult(res.data);
    } catch (err) {
      console.error("Pest detection failed:", err);
      setError("❌ Pest detection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 w-full max-w-lg mx-auto text-center">
      {/* Header */}
      <div className="flex flex-col items-center mb-4">
        <FaBug className="text-green-700 text-4xl mb-2" />
        <h3 className="text-2xl font-bold text-green-800">Pest / Disease Detection</h3>
        <p className="text-gray-600 text-sm mt-1">
          Upload an image of your crop to detect pests or diseases using AI.
        </p>
      </div>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-green-400 p-4 rounded-lg mb-4 bg-green-50 hover:bg-green-100 transition-all">
        {!preview ? (
          <label className="cursor-pointer text-green-700 flex flex-col items-center">
            <FaUpload className="text-3xl mb-2" />
            <span>Click or drag to upload image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Crop preview"
              className="w-full h-48 object-cover rounded-lg shadow-sm"
            />
            <button
              onClick={() => {
                setPreview(null);
                setFile(null);
                setResult(null);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
            >
              ✕ Remove
            </button>
          </div>
        )}
      </div>

      {/* Detect Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`px-6 py-2 rounded-lg font-semibold transition-all ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {loading ? "🔍 Detecting..." : "Detect"}
      </button>

      {/* Error Message */}
      {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}

      {/* Detection Result */}
      {result && (
        <div className="mt-6 text-left bg-green-50 p-4 rounded-lg border border-green-300 shadow-sm">
          <h4 className="text-lg font-bold text-green-800 mb-2">✅ Detection Result</h4>
          <p>
            <span className="font-semibold">🦠 Disease:</span> {result.disease || "N/A"}
          </p>
          <p className="mt-1">
            <span className="font-semibold">💊 Treatment:</span> {result.treatment || "N/A"}
          </p>
          {result.confidence && (
            <p className="mt-1">
              <span className="font-semibold">📊 Confidence:</span> {result.confidence}%
            </p>
          )}
        </div>
      )}
    </div>
  );
}
