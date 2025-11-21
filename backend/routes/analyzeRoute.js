import express from 'express';
import { computeHealthIndex, generateAIRecommendations } from '../ai-model/analyzeRegion.js';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

router.post('/analyze', async (req, res) => {
  const { bbox, user_id } = req.body;

  if (!bbox || !user_id) return res.status(400).json({ error: "Missing bbox or user_id" });

  try {
    // Compute a health index (placeholder logic)
    const healthIndex = computeHealthIndex({});

    // Generate realistic AI recommendations
    const aiData = generateAIRecommendations(healthIndex);

    // Save to Supabase (user-specific)
    const { data, error } = await supabase
      .from('regions')
      .insert([{
        user_id,
        bbox,
        health_index: healthIndex,
        status: aiData.status,
        color: aiData.color,
        recommendations: aiData.recommendations
      }])
      .select();

    if (error) return res.status(500).json({ error: error.message });

    res.json({
      clicked_region: `Region ${Math.floor(Math.random() * 1000)}`,
      health_index: healthIndex,
      status: aiData.status,
      color: aiData.color,
      recommendations: aiData.recommendations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze region" });
  }
});

export default router;
