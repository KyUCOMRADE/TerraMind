import fetch from 'node-fetch';

// Example: fetch NDVI from NASA MODIS WMS (simplified)
export async function getNDVI(lat, lon) {
  const url = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&LAYERS=MODIS_Terra_NDVI_16Day&QUERY_LAYERS=MODIS_Terra_NDVI_16Day&INFO_FORMAT=application/json&I=0&J=0&CRS=EPSG:4326&BBOX=${lat-0.01},${lon-0.01},${lat+0.01},${lon+0.01}&WIDTH=1&HEIGHT=1`;
  const res = await fetch(url);
  const data = await res.json();
  // Convert NDVI range -1..1 → 0..1
  const ndvi = (data.value + 1) / 2;
  return Math.min(Math.max(ndvi, 0), 1);
}

// Example: fetch rainfall from CHIRPS
export async function getRainfall(lat, lon) {
  const url = `https://data.chc.ucsb.edu/products/CHIRPS-2.0/global_monthly/tifs/p05/${lat},${lon}.tif`; 
  // Process TIF for value (use geotiff library)
  const rainfallNormalized = 0.7; // placeholder until parsing TIF
  return rainfallNormalized;
}

// Example: soil quality from FAO SoilGrids
export async function getSoilQuality(lat, lon) {
  const url = `https://rest.soilgrids.org/query?lon=${lon}&lat=${lat}`;
  const res = await fetch(url);
  const soil = await res.json();
  const organicC = soil?.properties?.ORGANIC_CARBON?.m?.mean ?? 0;
  // Normalize (example: 0..5%)
  const normalized = Math.min(organicC / 5, 1);
  return normalized;
}

export async function computeHealthIndex(lat, lon) {
  const ndvi = await getNDVI(lat, lon);
  const rainfall = await getRainfall(lat, lon);
  const soilQuality = await getSoilQuality(lat, lon);
  const humanImpact = 0.2; // placeholder or fetch population density

  const healthIndex = (0.5 * ndvi + 0.3 * rainfall + 0.2 * soilQuality) * (1 - humanImpact);
  return Math.min(Math.max(healthIndex, 0), 1);
}
