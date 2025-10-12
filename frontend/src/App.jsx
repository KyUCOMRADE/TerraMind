import React, { useState } from "react";
import MapComponent from "./components/MapComponent";
import Dashboard from "./components/Dashboard";
import RegionCard from "./components/RegionCard";

export default function App() {
  const [analyses, setAnalyses] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🌱 TerraMind — AI-Powered Land Monitoring</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* 🗺️ Map Section */}
        <div style={{ flex: 2 }}>
          <MapComponent
            analyses={analyses}
            setAnalyses={setAnalyses}
            setSelectedRegion={setSelectedRegion}
          />
        </div>

        {/* 📊 Dashboard + Region Info */}
        <div style={{ flex: 1 }}>
          {selectedRegion && (
            <RegionCard
              clicked_region={selectedRegion.clicked_region}
              lat={selectedRegion.lat}
              lon={selectedRegion.lon}
              health_index={selectedRegion.health_index}
              recommendation={selectedRegion.recommendation}
            />
          )}

          <Dashboard analyses={analyses} />
        </div>
      </div>
    </div>
  );
}
