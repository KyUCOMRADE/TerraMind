import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { computeHealthIndex, nearestRegionName, reverseGeocode } from "../ai-model/analyzeRegion";

export default function MapComponent({ analyses, setAnalyses }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
      mapContainer.innerHTML = "";
    }

    const map = L.map("map").setView([-0.3031, 36.08], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const handleClick = async (e) => {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;

      try {
        const regionName = await reverseGeocode(lat, lon);

        // Mock Supabase data (replace with real fetch if needed)
        const dbRegions = analyses; 
        const nearestName = nearestRegionName(dbRegions, lat, lon);
        const health_index = computeHealthIndex({ lat, lon });

        const recommendation = health_index >= 0.8
          ? "Land is healthy 🌱"
          : health_index >= 0.5
          ? "Moderate health – monitor regularly ⚠️"
          : health_index >= 0.3
          ? "Low health – consider intervention 🔧"
          : "Critical – urgent action required ❗";

        const analysis = { clicked_region: regionName, nearest_db_region: nearestName, lat, lon, health_index, recommendation };

        setAnalyses([...analyses, analysis]);
      } catch (err) {
        console.error("Failed to analyze region:", err);
      }
    };

    map.on("click", handleClick);
    mapRef.current = map;

    return () => {
      map.off("click", handleClick);
      map.remove();
    };
  }, [analyses, setAnalyses]);

  return <div id="map" style={{ width: "100%", height: "500px", borderRadius: "10px" }}></div>;
}
