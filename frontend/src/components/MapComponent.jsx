import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapComponent({ analyses, setAnalyses, setSelectedRegion }) {
  useEffect(() => {
    const map = L.map("map").setView([-1.286389, 36.817223], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    async function handleMapClick(e) {
      const { lat, lng } = e.latlng;
      console.log(`🗺️ Map clicked at: ${lat}, ${lng}`);

      // ✅ Build a small bounding box for the clicked area
      const bbox = [
        [lat - 0.01, lng - 0.01], // southwest corner
        [lat + 0.01, lng + 0.01], // northeast corner
      ];

      try {
        console.log("📤 Sending bbox to backend:", bbox);

        const response = await fetch("https://terramind.onrender.com/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bbox }),
        });

        if (!response.ok) {
          console.error("❌ Backend response not OK:", response.status);
          throw new Error("Backend response not OK");
        }

        const result = await response.json();
        console.log("✅ Analysis result received:", result);

        const newAnalysis = {
          clicked_region: result.clicked_region || "Unknown region",
          lat,
          lon: lng,
          health_index: result.health_index ?? "N/A",
          recommendation: result.recommendation || "No recommendation available",
        };

        // 🧭 Update state and selected region
        setAnalyses((prev) => [...prev, newAnalysis]);
        setSelectedRegion(newAnalysis);

        // 📍 Add a marker to the map with popup info
        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(
            `<b>${newAnalysis.clicked_region}</b><br>
             🌡️ Health Index: ${newAnalysis.health_index}<br>
             💡 Recommendation: ${newAnalysis.recommendation}`
          )
          .openPopup();
      } catch (err) {
        console.error("💥 Error analyzing region:", err.message);
        alert("Error analyzing region. Please try again.");
      }
    }

    map.on("click", handleMapClick);

    return () => map.remove();
  }, [setAnalyses, setSelectedRegion]);

  return (
    <div
      id="map"
      style={{
        height: "500px",
        borderRadius: "10px",
        border: "2px solid #ddd",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
      }}
    ></div>
  );
}
