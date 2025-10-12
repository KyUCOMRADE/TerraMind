import React, { useState } from "react";
import MapComponent from "./components/MapComponent";
import Dashboard from "./components/Dashboard";
import RegionCard from "./components/RegionCard";

function App() {
  const [analyses, setAnalyses] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🌱 TerraMind — AI-Powered Land Monitoring</h1>
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={{ flex: 2 }}>
          <MapComponent
            analyses={analyses}
            setAnalyses={setAnalyses}
            setSelectedRegion={setSelectedRegion}
          />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
          <RegionCard analysis={selectedRegion} />
          <Dashboard analyses={analyses} />
        </div>
      </div>
    </div>
  );
}

export default App;
