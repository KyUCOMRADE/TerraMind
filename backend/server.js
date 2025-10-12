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

// ✅ AI Analysis Route
app.post("/api/analyze", async (req, res) => {
  try {
    const { bbox } = req.body;
    console.log("📦 Received bbox:", bbox);

    if (!bbox || !Array.isArray(bbox) || bbox.length !== 2) {
      console.error("❌ Invalid bbox:", bbox);
      return res.status(400).json({ error: "Invalid bbox format" });
    }

    const [southWest, northEast] = bbox;
    const latCenter = (southWest[0] + northEast[0]) / 2;
    const lonCenter = (southWest[1] + northEast[1]) / 2;

    // --- Fetch nearest region from Supabase ---
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

    // --- AI Computation ---
    const health_index = computeHealthIndex(nearest);
    const recommendation = generateAIRecommendation
      ? generateAIRecommendation(health_index)
      : "AI model not available";

    // --- Response ---
    res.json({
      message: "✅ Region analysis complete",
      clicked_region: nearest.name || "Unknown region",
      lat: latCenter,
      lon: lonCenter,
      health_index,
      recommendation,
    });
  } catch (err) {
    console.error("💥 Error analyzing region:", err);
    res.status(500).json({ error: err.message || "Error analyzing region" });
  }
});

// ✅ Default route (for Render test)
app.get("/", (req, res) => {
  res.send("✅ TerraMind Backend Running Successfully!");
});

// ✅ Start Server
app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});
