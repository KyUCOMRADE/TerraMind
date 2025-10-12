import React from "react";

export default function RegionCard({ analysis }) {
  if (!analysis) return <p>No region selected.</p>;

  return (
    <div style={{
      border: `2px solid ${analysis.statusColor}`,
      borderRadius: "10px",
      padding: "15px",
      maxWidth: "400px",
      backgroundColor: "#f0fff0",
      boxShadow: "2px 2px 12px rgba(0,0,0,0.1)",
      marginTop: "20px"
    }}>
      <h3 style={{ marginBottom: "10px", color: analysis.statusColor }}>{analysis.clicked_region}</h3>
      <p><strong>Latitude:</strong> {analysis.lat.toFixed(4)}</p>
      <p><strong>Longitude:</strong> {analysis.lon.toFixed(4)}</p>
      <p><strong>Status:</strong> <span style={{ color: analysis.statusColor }}>{analysis.status}</span></p>
      <p><strong>Health Index:</strong> <span style={{ color: analysis.statusColor }}>{analysis.health_index}</span></p>
      <p style={{ marginTop: "10px", fontStyle: "italic", color: analysis.statusColor }}>
        Recommendation: {analysis.recommendation}
      </p>
    </div>
  );
}
