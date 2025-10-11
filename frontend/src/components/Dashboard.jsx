import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const getMarkerColor = (healthIndex) => {
  if (healthIndex >= 0.8) return "green";
  if (healthIndex >= 0.5) return "yellow";
  if (healthIndex >= 0.3) return "orange";
  return "red";
};

export default function Dashboard({ analyses }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const mapContainer = document.getElementById("analytics-map");

    if (!mapContainer) return;
    if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
      mapContainer.innerHTML = "";
    }

    const map = L.map("analytics-map").setView([-0.3031, 36.08], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    markersRef.current = [];

    analyses.forEach((data) => {
      const markerColor = getMarkerColor(data.health_index);

      const marker = L.circleMarker([data.lat, data.lon], {
        radius: 8,
        fillColor: markerColor,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(map);

      marker.bindPopup(
        `<b>${data.clicked_region}</b><br>Health Index: ${data.health_index}<br>Recommendation: ${data.recommendation}`
      );

      markersRef.current.push(marker);
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => map.removeLayer(m));
      markersRef.current = [];
      map.remove();
    };
  }, [analyses]);

  return (
    <div>
      <h2>Analytics</h2>
      {analyses.length === 0 ? (
        <p>No analysis data available. Click on map to analyze regions.</p>
      ) : (
        <>
          <div
            id="analytics-map"
            style={{ width: "100%", height: "400px", borderRadius: "10px", marginTop: "20px" }}
          ></div>

          <h3 style={{ marginTop: "20px" }}>Health Index History</h3>
          <LineChart width={600} height={250} data={analyses} style={{ marginTop: "10px" }}>
            <XAxis dataKey="clicked_region" />
            <YAxis domain={[0, 1]} />
            <CartesianGrid stroke="#ccc" />
            <Tooltip />
            <Line type="monotone" dataKey="health_index" stroke="#8884d8" />
          </LineChart>
        </>
      )}
    </div>
  );
}
