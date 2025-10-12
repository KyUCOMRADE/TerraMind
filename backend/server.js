import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { computeHealthIndex, generateAIRecommendation } from "./ai-model/analyzeRegion.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.post("/api/analyze", async (req, res) => {
  console.log("📩 Received request body:", req.body);

  try {
    const { bbox } = req.body || {};

    if (!bbox || !Array.isArray(bbox) || bbox.length !== 2) {
      return res.status(400).json({ error: "Invalid or missing bbox field" });
    }

    const [southWest, northEast] = bbox;
    const latCenter = (southWest[0] + northEast[0]) / 2;
    const lonCenter = (southWest[1] + northEast[1]) / 2;
    console.log(`🧭 Coordinates center: ${latCenter}, ${lonCenter}`);

    // --- Reverse Geocode ---
    let regionName = "Unknown region";
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latCenter}&lon=${lonCenter}`,
        { headers: { "User-Agent": "TerraMind/1.0 (chegejoseph5006@gmail.com)" } }
      );
      const locationData = await response.json();
      regionName =
        locationData.address?.state ||
        locationData.address?.county ||
        locationData.address?.village ||
        locationData.address?.town ||
        locationData.address?.city ||
        "Unknown region";
    } catch (err) {
      console.warn("❌ Reverse geocode failed:", err.message);
    }

    // --- Fetch nearest DB region ---
    const { data, error } = await supabase.from("regions").select("*");
    if (error) throw error;

    const nearest = data.reduce(
      (prev, curr) => {
        const dist = Math.sqrt((curr.lat - latCenter) ** 2 + (curr.lon - lonCenter) ** 2);
        return dist < prev.dist ? { ...curr, dist } : prev;
      },
      { dist: Infinity }
    );

    // --- AI Model ---
    const health_index = computeHealthIndex(nearest); // 0 to 1
    const recommendation = generateAIRecommendation(health_index);

    console.log("🧠 Computed Health Index:", health_index);
    console.log("💡 Recommendation:", recommendation);

    res.json({
      message: "Analysis successful!",
      clicked_region: regionName,
      nearest_db_region: nearest.name || "N/A",
      lat: latCenter,
      lon: lonCenter,
      health_index,
      recommendation,
    });
  } catch (error) {
    console.error("💥 Error analyzing region:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Default route for Render test
app.get("/", (req, res) => {
  res.send("✅ TerraMind Backend Running Successfully!");
});
