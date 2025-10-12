// frontend/src/ai-model/analyzeRegion.js

// Compute a mock vegetation/health index (replace with real AI later)
export function computeHealthIndex(regionData) {
  if (!regionData) return Math.random().toFixed(2);
  return (regionData.health_index ?? Math.random()).toFixed(2);
}

// Find the nearest region name
export function nearestRegionName(data, latCenter, lonCenter) {
  if (!data || !data.length) return "N/A";
  let nearest = data.reduce(
    (prev, curr) => {
      const dist = Math.sqrt((curr.lat - latCenter) ** 2 + (curr.lon - lonCenter) ** 2);
      return dist < prev.dist ? { ...curr, dist } : prev;
    },
    { dist: Infinity }
  );
  return nearest.name ?? "N/A";
}

// Reverse geocoding using OpenStreetMap API
export async function reverseGeocode(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    if (!response.ok) {
      console.warn("Reverse geocode failed:", await response.text());
      return "Unknown region";
    }
    const data = await response.json();
    return (
      data.address?.state ||
      data.address?.county ||
      data.address?.village ||
      data.address?.town ||
      data.address?.city ||
      "Unknown region"
    );
  } catch (err) {
    console.warn("Reverse geocode fetch error:", err.message);
    return "Unknown region";
  }
}

// Generate AI-based recommendations for the analyzed region
export function generateAIRecommendation(healthIndex, vegetationIndex) {
  const hi = parseFloat(healthIndex);
  const vi = parseFloat(vegetationIndex);

  if (isNaN(hi) || isNaN(vi)) return ["Insufficient data for recommendations."];

  const recs = [];

  if (hi < 0.4) {
    recs.push("🌾 Low health detected: Consider irrigation and soil restoration.");
  } else if (hi < 0.7) {
    recs.push("🌿 Moderate health: Maintain current farming practices and monitor soil moisture.");
  } else {
    recs.push("🍀 Excellent health: Great soil quality — keep monitoring biodiversity.");
  }

  if (vi < 0.4) {
    recs.push("🌻 Sparse vegetation: Try replanting native vegetation or cover crops.");
  } else if (vi < 0.7) {
    recs.push("🌱 Average vegetation: Fertilizer optimization may help improve yield.");
  } else {
    recs.push("🌳 Dense vegetation: Biodiversity and soil retention are healthy.");
  }

  recs.push("🛰️ Regularly use satellite monitoring for early stress detection.");

  return recs;
}
