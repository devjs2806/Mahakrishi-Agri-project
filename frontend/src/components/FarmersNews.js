import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FarmersNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/farmer-news");
        setNews(res.data.news || []);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-200 h-[600px] overflow-y-auto">
      <h2 className="text-2xl font-bold text-green-800 mb-4">📰 Farmer's News</h2>
      
      {loading ? (
        <p>Loading news...</p>
      ) : news.length === 0 ? (
        <p className="text-gray-500 italic">No news available</p>
      ) : (
        <ul className="space-y-4">
          {news.map((item, index) => (
            <li
              key={index}
              className="border-b pb-3 hover:bg-green-50 transition rounded-lg p-2"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 font-semibold hover:underline block"
              >
                {item.title}
              </a>
              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
              <p className="text-xs text-gray-400 italic mt-1">Source: {item.source}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
