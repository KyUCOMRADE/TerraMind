import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { computeHealthIndex, reverseGeocode } from "../ai-model/analyzeRegion";

export default function MapComponent({ analyses, setAnalyses, setSelectedRegion }) {
  useEffect(() => {
    const map = L.map("map").setView([-1.286389, 36.817223], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    async function handleMapClick(e) {
      const { lat, lng } = e.latlng;
      const clicked_region = await reverseGeocode(lat, lng);
      const health_index = computeHealthIndex({ lat, lon: lng });
      const recommendation = getAIRecommendation(health_index);

      const newAnalysis = {
        clicked_region,
        lat,
        lon: lng,
        health_index,
        recommendation,
      };

      setAnalyses((prev) => [...prev, newAnalysis]);
      setSelectedRegion(newAnalysis);

      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<b>${clicked_region}</b><br>Health Index: ${health_index}`)
        .openPopup();
    }

    map.on("click", handleMapClick);

    return () => map.remove();
  }, [setAnalyses, setSelectedRegion]);

  // 🧠 Simple AI Recommendation logic
  const getAIRecommendation = (healthIndex) => {
    if (healthIndex >= 0.8) return "Excellent condition — maintain sustainable practices 🌿";
    if (healthIndex >= 0.5) return "Moderate health — monitor periodically 🌾";
    if (healthIndex >= 0.3) return "Low health — consider soil restoration 🌍";
    return "Critical condition — urgent intervention needed 🚨";
  };

  return (
    <div
      id="map"
      style={{
        height: "500px",
        borderRadius: "10px",
        border: "2px solid #ddd",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
      }}
    ></div>
  );
}
