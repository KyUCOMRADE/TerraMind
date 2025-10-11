// ai-model/analyzeRegion.js
export function computeHealthIndex(region) {
  // Simple mock: you can replace with real AI logic later
  return region.health_index ?? Math.random().toFixed(2);
}

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

export async function reverseGeocode(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    if (!response.ok) {
      const text = await response.text();
      console.warn("Reverse geocode failed:", text);
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
