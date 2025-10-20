import React, { useEffect, useState } from "react";
import axios from "axios";
import FarmersNews from "../components/FarmersNews";

// ✅ Use Flask backend route now (no more CORS issues)
const BASE_URL = "http://127.0.0.1:5000/api/market-data";

export default function MarketPrices() {
  const [cropOptions, setCropOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [marketOptions, setMarketOptions] = useState([]);

  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("");

  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allRecords, setAllRecords] = useState([]);

  // 🟢 Step 1: Preload data from backend (proxy API)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await axios.get(BASE_URL);
        const records = res.data.records || [];
        console.log("✅ Records fetched:", records.length);

        setAllRecords(records);

        // Unique crops and states
        const crops = [...new Set(records.map(r => r.commodity).filter(Boolean))].sort();
        const states = [...new Set(records.map(r => r.state).filter(Boolean))].sort();

        setCropOptions(crops);
        setStateOptions(states);
      } catch (err) {
        console.error("❌ Error fetching initial data:", err);
      }
    };

    fetchInitialData();
  }, []);

  // 🟡 Step 2: Filter districts when state changes
  useEffect(() => {
    if (!selectedState) {
      setDistrictOptions([]);
      setMarketOptions([]);
      setSelectedDistrict("");
      setSelectedMarket("");
      return;
    }

    const districts = [
      ...new Set(
        allRecords
          .filter(r => r.state === selectedState)
          .map(r => r.district)
          .filter(Boolean)
      ),
    ].sort();

    setDistrictOptions(districts);
    setMarketOptions([]);
    setSelectedDistrict("");
    setSelectedMarket("");
  }, [selectedState, allRecords]);

  // 🟠 Step 3: Filter markets when district changes
  useEffect(() => {
    if (!selectedDistrict) {
      setMarketOptions([]);
      setSelectedMarket("");
      return;
    }

    const markets = [
      ...new Set(
        allRecords
          .filter(r => r.state === selectedState && r.district === selectedDistrict)
          .map(r => r.market)
          .filter(Boolean)
      ),
    ].sort();

    setMarketOptions(markets);
    setSelectedMarket("");
  }, [selectedDistrict, selectedState, allRecords]);

  // 🟤 Step 4: Handle price fetch for specific selection
  const handleGetPrice = async () => {
    if (!selectedCrop || !selectedState || !selectedDistrict || !selectedMarket) {
      alert("⚠️ Please select crop, state, district and market.");
      return;
    }

    setLoading(true);
    setPriceData(null);

    try {
      const filtered = allRecords.filter(
        (r) =>
          r.commodity === selectedCrop &&
          r.state === selectedState &&
          r.district === selectedDistrict &&
          r.market === selectedMarket
      );

      if (filtered.length > 0) {
        // Sort by date and pick the latest record
        filtered.sort(
          (a, b) => new Date(b.arrival_date) - new Date(a.arrival_date)
        );
        const latest = filtered[0];

        setPriceData({
          commodity: latest.commodity,
          state: latest.state,
          district: latest.district,
          market: latest.market,
          modal_price: latest.modal_price,
          min_price: latest.min_price,
          max_price: latest.max_price,
          arrival_date: latest.arrival_date,
        });
      } else {
        setPriceData({ error: "❌ No price data found for this selection." });
      }
    } catch (err) {
      console.error("Error fetching price data:", err);
      setPriceData({ error: "⚠️ Failed to fetch price data." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 🔽 Left Side: Dropdowns and Price Display */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-green-800">🌾 Market Price Finder</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Crop Dropdown */}
            <div>
              <label className="font-semibold">Crop</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">Select Crop</option>
                {cropOptions.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* State Dropdown */}
            <div>
              <label className="font-semibold">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">Select State</option>
                {stateOptions.map((s, i) => (
                  <option key={i} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* District Dropdown */}
            <div>
              <label className="font-semibold">District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                disabled={!selectedState}
              >
                <option value="">Select District</option>
                {districtOptions.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Market Dropdown */}
            <div>
              <label className="font-semibold">Market</label>
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                disabled={!selectedDistrict}
              >
                <option value="">Select Market</option>
                {marketOptions.map((m, i) => (
                  <option key={i} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleGetPrice}
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-semibold text-white transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Fetching..." : "Get Price"}
            </button>
          </div>
        </div>

        {/* 🪙 Price Display Section */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-green-800 mb-4">📈 Price Information</h3>
          {priceData ? (
            priceData.error ? (
              <p className="text-red-600">{priceData.error}</p>
            ) : (
              <div className="space-y-2 text-gray-800">
                <p><strong>Crop:</strong> {priceData.commodity}</p>
                <p><strong>State:</strong> {priceData.state}</p>
                <p><strong>District:</strong> {priceData.district}</p>
                <p><strong>Market:</strong> {priceData.market}</p>
                <p><strong>Modal Price:</strong> ₹{priceData.modal_price}</p>
                <p><strong>Min Price:</strong> ₹{priceData.min_price}</p>
                <p><strong>Max Price:</strong> ₹{priceData.max_price}</p>
                <p><strong>Date:</strong> {priceData.arrival_date}</p>
              </div>
            )
          ) : (
            <p className="text-gray-500 italic">Select options and click “Get Price”</p>
          )}
        </div>
      </div>

      {/* 📰 Right Side: Farmer News */}
      <div>
        <FarmersNews />
      </div>
    </div>
  );
}
