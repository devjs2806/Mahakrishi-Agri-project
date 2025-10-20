import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

// 📌 Import Pages
import Dashboard from "./pages/Dashboard";
import CropRecommendations from "./pages/CropRecommendations";
import PestDetection from "./pages/PestDetection";  // ✅ Make sure this file exists
import MarketPrices from "./pages/MarketPrices";
import Chat from "./pages/Chat";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  // 🔸 Dynamic styling for active NavLink
  const navLinkStyle = ({ isActive }) =>
    `transition hover:text-yellow-300 ${
      isActive ? "font-bold text-yellow-300 border-b-2 border-yellow-300" : "text-white"
    }`;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* ✅ Top Navigation Bar */}
        <nav className="bg-green-700 text-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* 🌿 Brand / Logo */}
              <div className="text-2xl font-bold tracking-wide cursor-pointer">
                🌿 MahaKrishi
              </div>

              {/* 🌐 Desktop Menu */}
              <div className="hidden md:flex gap-6 items-center">
                <NavLink to="/" end className={navLinkStyle}>
                  Dashboard
                </NavLink>
                <NavLink to="/crops" className={navLinkStyle}>
                  Crop Recommendations
                </NavLink>
                <NavLink to="/pest" className={navLinkStyle}>
                  Pest Detection
                </NavLink>
                <NavLink to="/market" className={navLinkStyle}>
                  Market Prices
                </NavLink>
                <NavLink to="/chat" className={navLinkStyle}>
                  Chat
                </NavLink>
              </div>

              {/* 📱 Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded hover:bg-green-800 transition"
              >
                {isOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {/* 📲 Mobile Dropdown Menu */}
          {isOpen && (
            <div className="md:hidden flex flex-col px-4 pb-4 gap-3 bg-green-800">
              <NavLink to="/" end className={navLinkStyle} onClick={() => setIsOpen(false)}>
                Dashboard
              </NavLink>
              <NavLink to="/crops" className={navLinkStyle} onClick={() => setIsOpen(false)}>
                Crop Recommendations
              </NavLink>
              <NavLink to="/pest" className={navLinkStyle} onClick={() => setIsOpen(false)}>
                Pest Detection
              </NavLink>
              <NavLink to="/market" className={navLinkStyle} onClick={() => setIsOpen(false)}>
                Market Prices
              </NavLink>
              <NavLink to="/chat" className={navLinkStyle} onClick={() => setIsOpen(false)}>
                Chat
              </NavLink>
            </div>
          )}
        </nav>

        {/* 🧭 Main Content Area */}
        <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/crops" element={<CropRecommendations />} />
            <Route path="/pest" element={<PestDetection />} /> {/* ✅ Pest Detection route */}
            <Route path="/market" element={<MarketPrices />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
