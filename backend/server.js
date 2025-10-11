import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { computeHealthIndex, nearestRegionName, reverseGeocode } from "./ai-model/analyzeRegion.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Supabase setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(cors({ origin: "*" }));
app.use(express.json());

// --- Test endpoint ---
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is live!" });
});

// --- Analyze region endpoint ---
app.post("/api/analyze", async (req, res) => {
  const { bbox } = req.body;
  if (!bbox || bbox.length !== 2) return res.status(400).json({ error: "Invalid bbox" });

  try {
    const [southWest, northEast] = bbox;
    const latCenter = (southWest[0] + northEast[0]) / 2;
    const lonCenter = (southWest[1] + northEast[1]) / 2;

    // Reverse geocode for region name
    const clickedRegion = await reverseGeocode(latCenter, lonCenter);

    // Fetch regions from Supabase
    const { data, error } = await supabase.from("regions").select("*");
    if (error) throw error;

    const nearest = nearestRegionName(data, latCenter, lonCenter);

    const health_index = computeHealthIndex({ health_index: data[0]?.health_index });

    res.json({
      message: "Region analysis complete",
      clicked_region: clickedRegion,
      nearest_db_region: nearest,
      health_index,
      lat: latCenter,
      lon: lonCenter,
    });
  } catch (err) {
    console.error("Error analyzing region:", err.message);
    res.status(500).json({ error: "Failed to analyze region", details: err.message });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
