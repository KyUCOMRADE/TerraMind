import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRegion from "./ai-model/analyzeRegion.js"; // ✅ default import

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/analyze", async (req, res) => {
  const { bbox } = req.body;
  try {
    const [southWest, northEast] = bbox;
    const latCenter = (southWest[0] + northEast[0]) / 2;
    const lonCenter = (southWest[1] + northEast[1]) / 2;

    // --- Use AI model ---
    const aiResult = analyzeRegion({ lat: latCenter, lon: lonCenter });

    // --- Reverse geocode ---
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latCenter}&lon=${lonCenter}`
    );
    const locationData = await response.json();

    const regionName =
      locationData.address?.state ||
      locationData.address?.county ||
      locationData.address?.village ||
      locationData.address?.town ||
      locationData.address?.city ||
      "Unknown region";

    res.json({
      message: "Region analysis complete",
      clicked_region: regionName,
      nearest_db_region: "N/A",
      lat: latCenter,
      lon: lonCenter,
      ...aiResult
    });
  } catch (err) {
    console.error("Error analyzing region:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
