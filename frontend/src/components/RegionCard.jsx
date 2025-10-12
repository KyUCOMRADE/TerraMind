import React from "react";

const getHealthStatus = (healthIndex) => {
  if (healthIndex >= 0.8) 
    return { color: "#2E7D32", message: "Land is healthy 🌱", recommendation: "Maintain sustainable practices 🌿" };
  if (healthIndex >= 0.5) 
    return { color: "#FBC02D", message: "Moderate health ⚠️", recommendation: "Monitor periodically 🌾" };
  if (healthIndex >= 0.3) 
    return { color: "#F57C00", message: "Low health 🔧", recommendation: "Consider soil restoration 🌍" };
  return { color: "#D32F2F", message: "Critical ❗", recommendation: "Urgent intervention needed 🚨" };
};

export default function RegionCard({ selectedRegion }) {
  if (!selectedRegion) return <p>No region selected.</p>;

  const { clicked_region, lat, lon, health_index, recommendation: aiRecommendation } = selectedRegion;
  const { color, message, recommendation } = getHealthStatus(health_index);

  return (
    <div style={{
      border: `2px solid ${color}`,
      borderRadius: "10px",
      padding: "15px",
      maxWidth: "400px",
      backgroundColor: "#f0fff0",
      boxShadow: "2px 2px 12px rgba(0,0,0,0.1)",
      marginTop: "20px"
    }}>
      <h3 style={{ marginBottom: "10px", color }}>{clicked_region}</h3>
      <p><strong>Latitude:</strong> {lat.toFixed(4)}</p>
      <p><strong>Longitude:</strong> {lon.toFixed(4)}</p>
      <p><strong>Health Index:</strong> <span style={{ color }}>{health_index}</span></p>
      <p style={{ marginTop: "10px", fontStyle: "italic", color }}>
        Status: {message}
      </p>
      <p style={{ marginTop: "5px", fontStyle: "italic", color }}>
        Recommendation: {aiRecommendation || recommendation}
      </p>
    </div>
  );
}
