import React from "react";

export default function Dashboard({ analyses }) {
  if (!analyses || analyses.length === 0) return <p>No analyses yet.</p>;

  return (
    <div style={{
      border: "2px solid #ddd",
      borderRadius: "10px",
      padding: "15px",
      backgroundColor: "#fff8e1",
      maxHeight: "400px",
      overflowY: "auto"
    }}>
      <h3>Analytics Dashboard</h3>
      {analyses.map((a, idx) => (
        <div key={idx} style={{ marginBottom: "10px", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>
          <p><strong>{a.clicked_region}</strong></p>
          <p>Status: <span style={{ color: a.statusColor }}>{a.status}</span></p>
          <p>Health Index: {a.health_index}</p>
          <p>Recommendation: {a.recommendation}</p>
        </div>
      ))}
    </div>
  );
}
