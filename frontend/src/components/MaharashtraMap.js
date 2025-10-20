import React, { useState } from "react";
import maharashtraGeo from "../data/maharashtraDivisions.json"; // we'll create this file
import "./MaharashtraMap.css";

export default function MaharashtraMap() {
  const [hoveredDivision, setHoveredDivision] = useState(null);

  return (
    <div className="relative w-full flex justify-center">
      <svg
        viewBox="0 0 800 800"
        className="w-full max-w-3xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        {maharashtraGeo.map((division) => (
          <path
            key={division.id}
            d={division.path} // actual SVG path of the division
            className={`division-shape ${
              hoveredDivision === division.id ? "hovered" : ""
            }`}
            onMouseEnter={() => setHoveredDivision(division.id)}
            onMouseLeave={() => setHoveredDivision(null)}
          />
        ))}
      </svg>

      {hoveredDivision && (
        <div className="tooltip-box">
          <h3 className="font-bold text-lg text-green-800">
            📍 {maharashtraGeo.find((d) => d.id === hoveredDivision).name}
          </h3>
          <p>
            🏘 Districts:{" "}
            {maharashtraGeo.find((d) => d.id === hoveredDivision).districts.join(", ")}
          </p>
          <p>
            🌱 Soil Types:{" "}
            {maharashtraGeo.find((d) => d.id === hoveredDivision).soilTypes.join(", ")}
          </p>
          <p>
            🌧 Rainfall:{" "}
            {maharashtraGeo.find((d) => d.id === hoveredDivision).rainfall} mm
          </p>
        </div>
      )}
    </div>
  );
}
