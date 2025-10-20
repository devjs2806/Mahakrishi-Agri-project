import React, { useState, useEffect } from "react";
import axios from "axios";

const preventionMeasures = {
  Ants: "Keep the area clean and dry. Remove sugary residues and use neem oil or citrus repellents.",
  Bees: "Avoid disturbing the hive. Encourage natural pollination unless it's a severe infestation.",
  Beetles: "Handpick beetles early morning. Neem oil or insecticidal soap can control their population.",
  Caterpillars: "Use neem sprays and encourage natural predators like ladybugs or birds.",
  Earthworms: "Earthworms are beneficial. No action needed; they improve soil health.",
  Earwigs: "Remove plant debris. Use damp traps to collect them overnight.",
  Grasshoppers: "Install row covers, reduce weeds, and apply neem or garlic sprays.",
  Moths: "Pheromone traps help catch adults. Control larvae with organic pesticides.",
  Slugs: "Copper tape barriers work well. Remove mulch where they hide.",
  Snails: "Use crushed eggshell barriers and remove them manually in the evening.",
  Wasps: "Do not disturb nests. Use professional pest removal services if needed.",
  Weevils: "Keep stored grains clean and dry. Use airtight containers and clean frequently."
};

const fertilizerInfo = {
  Ants: "Ants don't require fertilizer treatment. Improve soil drainage and apply natural repellents.",
  Bees: "Bees don’t harm crops directly. Encourage flowering plants for pollination balance.",
  Beetles: "Apply neem cake fertilizer to improve resistance and soil health.",
  Caterpillars: "Use organic fertilizers with potassium to strengthen plants against leaf damage.",
  Earthworms: "No fertilizer required. Earthworms enrich the soil naturally.",
  Earwigs: "Use compost manure to balance soil nutrients and discourage pest buildup.",
  Grasshoppers: "Potassium-rich fertilizers help plants recover from chewing damage.",
  Moths: "A balanced NPK fertilizer improves crop resilience against larvae damage.",
  Slugs: "Maintain proper nitrogen levels to prevent weak, over-watered plants that attract slugs.",
  Snails: "Use organic compost to maintain healthy moisture without overwatering.",
  Wasps: "Fertilizers aren't used against wasps. Keep plants healthy to avoid attracting pests.",
  Weevils: "Fertilize with balanced NPK to improve plant defense and reduce storage infestation risk."
};

export default function PestDetection() {
  const [file, setFile] = useState(null);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState("general");
  const [selectedPest, setSelectedPest] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("crop", crop);

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/pest-detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDetections(res.data.detections || []);
    } catch (err) {
      console.error("Error detecting pest:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Auto-select most confident pest after detection
  useEffect(() => {
    if (detections.length > 0) {
      const topPest = detections[0].class;
      setSelectedPest(topPest);
    }
  }, [detections]);

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6 text-green-800">🪲 Pest Detection</h1>

      <select
        className="border rounded-lg px-4 py-2 mb-4"
        value={crop}
        onChange={(e) => setCrop(e.target.value)}
      >
        <option value="general">General</option>
        <option value="rice">Rice</option>
        <option value="onion">Onion</option>
      </select>

      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition"
        disabled={loading}
      >
        {loading ? "Detecting..." : "Upload & Detect"}
      </button>

      {detections.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-lg font-semibold mb-3">✅ Detections:</h2>
          <ul className="space-y-2">
            {detections.map((det, idx) => (
              <li key={idx} className="text-gray-800">
                <strong>{det.class}</strong> — Confidence: {det.confidence}
              </li>
            ))}
          </ul>

          {/* 🧠 Pest Selection Dropdown */}
          <div className="mt-4">
            <label className="block text-gray-700 mb-1 font-medium">
              Select Pest to See Preventive Measures & Fertilizer Info
            </label>
            <select
              value={selectedPest}
              onChange={(e) => setSelectedPest(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full"
            >
              <option value="">-- Select Pest --</option>
              {Object.keys(preventionMeasures).map((pest) => (
                <option key={pest} value={pest}>{pest}</option>
              ))}
            </select>
          </div>

          {/* 🛡 Preventive Measures Display */}
          {selectedPest && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-300 text-gray-800">
              <strong>🛡 Preventive Measures for {selectedPest}:</strong>
              <p className="mt-2">{preventionMeasures[selectedPest]}</p>
            </div>
          )}

          {/* 🌿 Fertilizer Information Display */}
          {selectedPest && (
            <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-300 text-gray-800">
              <strong>🌿 Fertilizer/Treatment Info:</strong>
              <p className="mt-2">{fertilizerInfo[selectedPest]}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
