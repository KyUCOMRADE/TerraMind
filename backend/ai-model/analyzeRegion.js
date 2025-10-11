// backend/ai-model/analyzeRegion.js
export default function analyzeRegion({ lat, lon }) {
  /**
   * Fake AI logic for demonstration:
   * - Health index decreases if near longitude > 36.5
   * - Random variation added
   */

  let baseHealth = 0.5; // start neutral

  if (lon > 36.5) baseHealth -= 0.2;
  if (lat < -0.5) baseHealth += 0.1;

  // Add random small variation
  const variation = Math.random() * 0.2 - 0.1;
  const healthIndex = Math.min(Math.max(baseHealth + variation, 0), 1);

  return {
    health_index: parseFloat(healthIndex.toFixed(2)),
    recommendation: healthIndex < 0.4
      ? "Consider reforestation or soil restoration"
      : "Region is healthy, maintain current practices"
  };
}
