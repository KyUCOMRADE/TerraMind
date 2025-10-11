// ai-model/analyzeRegion.js
export function computeHealthIndex(region) {
  // Simple mock: you can replace with real AI logic later
  return region.health_index ?? Math.random().toFixed(2);
}

// Return the nearest region from Supabase DB
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

// For deployed backend, skip Nominatim
export async function getRegionName(latCenter, lonCenter, data) {
  // Use nearest DB region instead of external API
  return nearestRegionName(data, latCenter, lonCenter);
}
