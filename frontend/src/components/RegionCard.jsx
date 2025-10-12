import React from "react";

export default function RegionCard({ analysis }) {
  if (!analysis) return null;

  const { clicked_region, lat, lon, health_index, recommendation } = analysis;

  const getColor = () => {
    if (health_index >= 0.8) return "#2E7D32";
    if (health_index >= 0.5) return "#FBC02D";
    if (health_index >= 0.3) return "#F57C00";
    return "#D32F2F";
  };

  const color = getColor();

  return (
    <div
      style={{
        border: `2px solid ${color}`,
        borderRadius: "10px",
        padding: "15px",
        maxWidth: "400px",
        backgroundColor: "#f0fff0",
        boxShadow: "2px 2px 12px rgba(0,0,0,0.1)",
        marginTop: "20px",
      }}
    >
      <h3 style={{ marginBottom: "10px", color }}>{clicked_region}</h3>
      <p>
        <strong>Latitude:</strong> {lat.toFixed(4)}
      </p>
      <p>
        <strong>Longitude:</strong> {lon.toFixed(4)}
      </p>
      <p>
        <strong>Health Index:</strong> <span style={{ color }}>{health_index}</span>
      </p>
      <p style={{ marginTop: "10px", fontStyle: "italic", color }}>
        Recommendation: {recommendation}
      </p>
    </div>
  );
}
