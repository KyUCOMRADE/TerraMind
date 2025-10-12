import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard({ analyses }) {
  if (!analyses || analyses.length === 0) return <p>No analyses yet.</p>;

  // Map health_index to color-coded status
  const getStatus = (hi) => {
    if (hi >= 0.8) return { status: "Healthy 🌱", color: "#2E7D32" };
    if (hi >= 0.5) return { status: "Moderate ⚠️", color: "#FBC02D" };
    if (hi >= 0.3) return { status: "Low 🔧", color: "#F57C00" };
    return { status: "Critical ❗", color: "#D32F2F" };
  };

  const chartData = analyses.map((a) => ({
    name: a.clicked_region,
    health_index: a.health_index,
    statusInfo: getStatus(a.health_index),
  }));

  return (
    <div
      style={{
        border: "2px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        backgroundColor: "#f0fff0",
      }}
    >
      <h3>Analytics Dashboard</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 1]} />
          <Tooltip
            formatter={(value, name, props) => {
              const info = props.payload.statusInfo;
              return [`${value}`, `${info.status}`];
            }}
          />
          <Line
            type="monotone"
            dataKey="health_index"
            stroke="#2E7D32"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ marginTop: "15px" }}>
        <h4>Status Overview</h4>
        {chartData.map((a, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
              padding: "5px",
              borderRadius: "5px",
              backgroundColor: "#fff",
              borderLeft: `6px solid ${a.statusInfo.color}`,
            }}
          >
            <span>{a.name}</span>
            <span>{a.statusInfo.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
