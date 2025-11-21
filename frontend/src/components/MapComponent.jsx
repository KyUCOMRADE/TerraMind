// MapComponent.jsx
import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapComponent({ analyses, setAnalyses, setSelectedRegion, userId }) {
  useEffect(() => {
    const map = L.map('map').setView([-1.286389, 36.817223], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);

    async function handleMapClick(e) {
      const { lat, lng } = e.latlng;
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analyze`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ bbox: [[lat-0.01,lng-0.01],[lat+0.01,lng+0.01]], user_id: userId })
        });
        if (!response.ok) throw new Error('Backend response not OK');
        const result = await response.json();

        const newAnalysis = {
          clicked_region: result.clicked_region,
          lat, lon: lng,
          health_index: result.health_index ?? 0,
          recommendation: result.recommendation || 'No recommendation'
        };

        setAnalyses(prev => [...prev, newAnalysis]);
        setSelectedRegion(newAnalysis);

        L.marker([lat,lng]).addTo(map)
          .bindPopup(`<b>${newAnalysis.clicked_region}</b><br>Health Index: ${newAnalysis.health_index}<br>Recommendation: ${newAnalysis.recommendation}`)
          .openPopup();

      } catch (err) {
        console.error('Failed to analyze region:', err.message);
        alert('Error analyzing region.');
      }
    }

    map.on('click', handleMapClick);
    return () => map.remove();
  }, [setAnalyses, setSelectedRegion, userId]);

  return <div id="map" style={{ height:'500px', borderRadius:'10px', border:'2px solid #ddd', boxShadow:'0 0 8px rgba(0,0,0,0.1)' }} />;
}
