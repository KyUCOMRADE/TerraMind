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
    if (!bbox) return res.status(400).json({ error: "Missing bbox field in request body" });

    const [southWest, northEast] = bbox;
    const latCenter = (southWest[0] + northEast[0]) / 2;
    const lonCenter = (southWest[1] + northEast[1]) / 2;

    // Reverse geocode
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latCenter}&lon=${lonCenter}`,
      { headers: { "User-Agent": "TerraMind/1.0 (chegejoseph5006@gmail.com)" } }
    );
    const locationData = await response.json();
    const regionName =
      locationData.address?.state ||
      locationData.address?.county ||
      locationData.address?.village ||
      locationData.address?.town ||
      locationData.address?.city ||
      "Unknown region";

    // Fetch nearest DB region
    const { data, error } = await supabase.from("regions").select("*");
    if (error) throw error;

    const nearest = data.reduce(
      (prev, curr) => {
        const dist = Math.sqrt((curr.lat - latCenter) ** 2 + (curr.lon - lonCenter) ** 2);
        return dist < prev.dist ? { ...curr, dist } : prev;
      },
      { dist: Infinity }
    );

    const health_index = computeHealthIndex(nearest);
    const aiResult = generateAIRecommendation(health_index);

    res.json({
      clicked_region: regionName,
      nearest_db_region: nearest.name || "N/A",
      lat: latCenter,
      lon: lonCenter,
      health_index,
      recommendation: aiResult.recommendation,
      status: aiResult.status,
      statusColor: aiResult.color,
    });
  } catch (error) {
    console.error("💥 Error analyzing region:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => res.send("✅ TerraMind Backend Running Successfully!"));
