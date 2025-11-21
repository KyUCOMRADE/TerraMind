// =========================
// Frontend: App.jsx (Updated minimal integration)
// =========================
import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import RegionCard from './components/RegionCard';

export default function App() {
  const [analyses, setAnalyses] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  return (
    <div style={{ padding:'20px', fontFamily:'Arial, sans-serif' }}>
      <h1>🌱 TerraMind — AI-Powered Land Monitoring</h1>
      <div style={{ display:'flex', gap:'20px', marginTop:'20px' }}>
        <div style={{ flex:2 }}>
          <MapComponent analyses={analyses} setAnalyses={setAnalyses} setSelectedRegion={setSelectedRegion} />
        </div>
        <div style={{ flex:1 }}>
          <RegionCard selectedRegion={selectedRegion} />
        </div>
      </div>
    </div>
  );
}
