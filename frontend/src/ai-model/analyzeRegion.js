// ai-model/analyzeRegion.js

// Compute health index (0-1)
export function computeHealthIndex(regionData) {
  // Example logic: random for now, can replace with actual AI
  return regionData.health_index ?? +(Math.random()).toFixed(2);
}

// Map health index to recommendation and status
export function generateAIRecommendation(healthIndex) {
  if (healthIndex >= 0.8) {
    return {
      status: "Healthy 🌱",
      recommendation: "Excellent condition — maintain sustainable practices 🌿",
      color: "#2E7D32",
    };
  } else if (healthIndex >= 0.5) {
    return {
      status: "Moderate ⚠️",
      recommendation: "Moderate health — monitor periodically 🌾",
      color: "#FBC02D",
    };
  } else if (healthIndex >= 0.3) {
    return {
      status: "Low 🔧",
      recommendation: "Low health — consider soil restoration 🌍",
      color: "#F57C00",
    };
  } else {
    return {
      status: "Critical ❗",
      recommendation: "Critical condition — urgent intervention needed 🚨",
      color: "#D32F2F",
    };
  }
}
