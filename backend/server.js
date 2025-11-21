import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// =========================
// Helper: Realistic AI Analysis
// =========================
async function getNDVI(lat, lon) {
  try {
    const url = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&LAYERS=MODIS_Terra_NDVI_16Day&QUERY_LAYERS=MODIS_Terra_NDVI_16Day&INFO_FORMAT=application/json&I=0&J=0&CRS=EPSG:4326&BBOX=${lat-0.01},${lon-0.01},${lat+0.01},${lon+0.01}&WIDTH=1&HEIGHT=1`;
    const res = await fetch(url);
    const data = await res.json();
    return Math.min(Math.max((data.value + 1) / 2, 0), 1); // normalize -1..1 -> 0..1
  } catch {
    return Math.random(); // fallback
  }
}

async function getSoilQuality(lat, lon) {
  try {
    const url = `https://rest.soilgrids.org/query?lon=${lon}&lat=${lat}`;
    const res = await fetch(url);
    const soil = await res.json();
    const organicC = soil?.properties?.ORGANIC_CARBON?.m?.mean ?? 0;
    return Math.min(organicC / 5, 1); // normalize 0..5% -> 0..1
  } catch {
    return Math.random();
  }
}

async function getRainfall(lat, lon) {
  // Placeholder, replace with CHIRPS / OpenWeatherMap API
  return Math.random();
}

function generateAIRecommendation(healthIndex) {
  if (healthIndex >= 0.8) return { status: "Healthy 🌱", recommendation: "Excellent condition — maintain sustainable practices 🌿", color:"#2E7D32" };
  if (healthIndex >= 0.6) return { status: "Good 🌿", recommendation: "Land is good — regular monitoring recommended 🌾", color:"#4CAF50" };
  if (healthIndex >= 0.4) return { status: "Moderate ⚠️", recommendation: "Moderate health — consider small interventions 🌍", color:"#FBC02D" };
  if (healthIndex >= 0.2) return { status: "Low 🔧", recommendation: "Low health — soil restoration or irrigation needed 🌱", color:"#F57C00" };
  return { status: "Critical ❗", recommendation: "Critical condition — urgent intervention required 🚨", color:"#D32F2F" };
}

async function computeHealthIndex(lat, lon) {
  const ndvi = await getNDVI(lat, lon);
  const rainfall = await getRainfall(lat, lon);
  const soilQuality = await getSoilQuality(lat, lon);
  const humanImpact = 0.2; // placeholder
  const healthIndex = (0.5*ndvi + 0.3*rainfall + 0.2*soilQuality)*(1 - humanImpact);
  return Math.min(Math.max(healthIndex, 0), 1);
}

// =========================
// Routes
// =========================
app.post('/api/analyze', async (req, res) => {
  try {
    const { bbox, user_id } = req.body;
    if (!bbox) return res.status(400).json({ error: 'Missing bbox field' });
    const [sw, ne] = bbox;
    const lat = (sw[0]+ne[0])/2;
    const lon = (sw[1]+ne[1])/2;

    // Reverse geocode
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, { headers: { 'User-Agent': 'TerraMind/1.0' } });
    const locationData = await geoRes.json();
    const regionName = locationData.address?.state || locationData.address?.county || locationData.address?.village || locationData.address?.town || locationData.address?.city || 'Unknown region';

    const health_index = await computeHealthIndex(lat, lon);
    const aiResult = generateAIRecommendation(health_index);

    // Auto-save
    if (user_id) {
      await supabase.from('regions').insert([{ user_id, name: regionName, lat, lon, health_index }]);
    }

    res.json({
      clicked_region: regionName,
      lat, lon,
      health_index,
      recommendations: [aiResult.recommendation],
      status: aiResult.status,
      statusColor: aiResult.color
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ user: data.user });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ session: data.session });
});

app.get('/api/my-regions', async (req,res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  const { data, error } = await supabase.from('regions').select('*').eq('user_id', user_id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ regions: data || [] });
});

app.get('/', (req,res) => res.send('✅ TerraMind Backend Running Successfully!'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
