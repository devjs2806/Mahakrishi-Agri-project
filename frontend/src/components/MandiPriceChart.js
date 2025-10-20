import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MandiPriceChart({ crop_id = "Wheat", region = "Delhi" }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/mandi-prices?crop=${crop_id}&region=${region}`
        );
        const data = await response.json();

        if (data && data.historical && data.historical.length > 0) {
          const labels = data.historical.map((d) => d.date);
          const prices = data.historical.map((d) => d.price);

          // Predicted price for tomorrow
          labels.push("Predicted");
          prices.push(data.predicted_price);

          setChartData({
            labels,
            datasets: [
              {
                label: `${crop_id} Price (₹/quintal)`,
                data: prices,
                borderColor: "rgba(34,197,94,1)", // green-500
                backgroundColor: "rgba(34,197,94,0.2)",
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
            ],
          });
        } else {
          throw new Error("No data from API");
        }
      } catch (err) {
        console.error("Error fetching mandi prices:", err);
        setError("⚠️ Failed to fetch data. Showing sample data...");

        // Fallback sample data
        const historical_prices = [
          { date: "2025-09-20", price: 2200 },
          { date: "2025-09-21", price: 2250 },
          { date: "2025-09-22", price: 2180 },
          { date: "2025-09-23", price: 2300 },
          { date: "2025-09-24", price: 2280 },
        ];

        const labels = historical_prices.map((d) => d.date);
        const prices = historical_prices.map((d) => d.price);
        labels.push("Predicted");
        prices.push(2320);

        setChartData({
          labels,
          datasets: [
            {
              label: `${crop_id} Price (₹/quintal)`,
              data: prices,
              borderColor: "rgba(239,68,68,1)", // red-500
              backgroundColor: "rgba(239,68,68,0.2)",
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [crop_id, region]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: { color: "#111" },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "#111",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
      title: {
        display: false,
      },
    },
    interaction: { intersect: false },
    scales: {
      x: {
        ticks: { color: "#444" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#444" },
        grid: { color: "#e5e7eb" },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl border border-gray-200">
      <h3 className="text-2xl font-bold text-green-800 mb-2 text-center">
        📈 Market Prices for {crop_id} ({region})
      </h3>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500 animate-pulse text-lg">
            ⏳ Loading price trends...
          </div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mb-4">{error}</div>
      ) : (
        chartData && <Line data={chartData} options={options} />
      )}

      <p className="mt-4 text-center text-sm text-gray-500">
        📊 Historical and predicted mandi price trends powered by MahaKrishi AI
      </p>
    </div>
  );
}
