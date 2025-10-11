import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const getMarkerColor = (healthIndex) => {
  if (healthIndex >= 0.8) return "green";
  if (healthIndex >= 0.5) return "yellow";
  if (healthIndex >= 0.3) return "orange";
  return "red";
};

export default function MapComponent({ onRegionSelect }) {
  const markersRef = useRef([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const mapContainer = document.getElementById("map");

    if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
      mapContainer.innerHTML = "";
    }

    const map = L.map("map").setView([-0.3031, 36.08], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const clickHandler = async (e) => {
      if (!onRegionSelect) return;

      const bbox = [
        [e.latlng.lat - 0.02, e.latlng.lng - 0.02],
        [e.latlng.lat + 0.02, e.latlng.lng + 0.02],
      ];

      try {
        setLoading(true);
        const response = await fetch(import.meta.env.VITE_BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bbox }),
        });

        const data = await response.json();
        setLoading(false);

        if (!data || data.error) {
          console.error("❌ Failed to analyze region:", data?.error || "Unknown error");
          return;
        }

        onRegionSelect({
          clicked_region: data.clicked_region,
          lat: data.lat,
          lon: data.lon,
          health_index: data.health_index,
          recommendation: data.recommendation,
        });

        const markerColor = getMarkerColor(data.health_index);
        const marker = L.circleMarker([data.lat, data.lon], {
          radius: 10,
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

      } catch (err) {
        console.error("❌ Failed to analyze region:", err);
        setLoading(false);
      }
    };

    map.on("click", clickHandler);

    return () => {
      map.off("click", clickHandler);
      markersRef.current.forEach((m) => map.removeLayer(m));
      markersRef.current = [];
    };
  }, [onRegionSelect]);

  return (
    <div style={{ position: "relative" }}>
      {loading && (
        <div style={{
          position: "absolute", top: 0, left: 0, width: "100%", height: "500px",
          display: "flex", justifyContent: "center", alignItems: "center",
          background: "rgba(255,255,255,0.6)", zIndex: 999
        }}>
          <div>Analyzing... 🔄</div>
        </div>
      )}
      <div
        id="map"
        style={{ width: "100%", height: "500px", borderRadius: "10px", marginTop: "20px" }}
      ></div>
    </div>
  );
}
