import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Charts({ data }) {
  const lineData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        label: "Health Index",
        data: data.map((d) => d.health_index),
        borderColor: "green",
        backgroundColor: "rgba(0,128,0,0.2)",
      },
    ],
  };

  return <Line data={lineData} />;
}
