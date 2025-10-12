import React from "react";

export default function RegionCard({ clicked_region, lat, lon, health_index, recommendation }) {
  if (!clicked_region) return null;

  const getHealthStatus = (healthIndex) => {
    if (healthIndex >= 0.8) return { color: "#2E7D32", message: "Land is healthy 🌱" };
    if (healthIndex >= 0.5) return { color: "#FBC02D", message: "Moderate health ⚠️" };
    if (healthIndex >= 0.3) return { color: "#F57C00", message: "Low health 🔧" };
    return { color: "#D32F2F", message: "Critical condition ❗" };
  };

  const { color, message } = getHealthStatus(health_index);

  return (
    <div
      style={{
        border: `2px solid ${color}`,
        borderRadius: "10px",
        padding: "15px",
        backgroundColor: "#f8fff8",
        marginBottom: "20px",
        boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ color, marginBottom: "10px" }}>{clicked_region}</h3>
      <p><strong>Latitude:</strong> {lat.toFixed(4)}</p>
      <p><strong>Longitude:</strong> {lon.toFixed(4)}</p>
      <p><strong>Health Index:</strong> <span style={{ color }}>{health_index}</span></p>
      <p><strong>AI Recommendation:</strong> {recommendation}</p>
      <p style={{ color, fontStyle: "italic", marginTop: "8px" }}>Status: {message}</p>
    </div>
  );
}
