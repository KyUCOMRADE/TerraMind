import React, { useState } from "react";
import MapComponent from "./components/MapComponent.jsx";
import RegionCard from "./components/RegionCard.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const [currentTab, setCurrentTab] = useState("map");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [analyses, setAnalyses] = useState([]);

  const handleRegionSelect = (regionData) => {
    setSelectedRegion(regionData);
    setAnalyses((prev) => [...prev, regionData]);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <nav style={{ marginBottom: "20px" }}>
        <button onClick={() => setCurrentTab("map")} style={{ marginRight: "10px", padding: "8px 12px" }}>Map</button>
        <button onClick={() => setCurrentTab("analytics")} style={{ padding: "8px 12px" }}>Analytics</button>
      </nav>

      {currentTab === "map" && (
        <>
          <MapComponent onRegionSelect={handleRegionSelect} />
          {selectedRegion && <RegionCard {...selectedRegion} />}
        </>
      )}

      {currentTab === "analytics" && <Dashboard analyses={analyses} />}
    </div>
  );
}
