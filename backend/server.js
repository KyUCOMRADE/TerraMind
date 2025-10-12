import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { computeHealthIndex, generateAIRecommendation } from "./ai-model/analyzeRegion.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.post("/api/analyze", async (req, res) => {
  const { bbox } = req.body;

  try {
    const [southWest, northEast] = bbox;
    const latCenter = (southWest[0] + northEast[0]) / 2;
    const lonCenter = (southWest[1] + northEast[1]) / 2;

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
      console.error("Reverse geocode failed:", err.message);
    }

    // --- Fetch nearest DB region ---
    const { data, error } = await supabase.from("regions").select("*");
    if (error) throw error;

    const nearest = data.reduce(
      (prev, curr) => {
        const dist = Math.sqrt(
          (curr.lat - latCenter) ** 2 + (curr.lon - lonCenter) ** 2
        );
        return dist < prev.dist ? { ...curr, dist } : prev;
      },
      { dist: Infinity }
    );

    // --- AI Model Computation ---
    const health_index = computeHealthIndex(nearest);
    const recommendation = generateRecommendation(health_index);

    res.json({
      message: "Region analysis complete",
      clicked_region: regionName,
      nearest_db_region: nearest.name,
      health_index,
      recommendation,
      lat: latCenter,
      lon: lonCenter,
    });
  } catch (err) {
    console.error("Error analyzing region:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);

// Default route for Render test
app.get("/", (req, res) => {
  res.send("✅ TerraMind Backend Running Successfully!");
});

