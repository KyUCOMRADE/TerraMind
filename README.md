# TerraMind 🌱

**AI-Powered Land Monitoring and Analytics**

---

## Overview

TerraMind is a cutting-edge full-stack web application designed to analyze and visualize land health metrics using AI-driven insights. It empowers users to assess land conditions, receive actionable recommendations, and monitor land health trends over time.

---

## Project Structure

```
TerraMind/
 ├─ frontend/
 │   ├─ src/
 │   │   ├─ components/
 │   │   │   ├─ Dashboard.jsx
 │   │   │   ├─ MapComponent.jsx
 │   │   │   └─ RegionCard.jsx
 │   │   ├─ App.jsx
 │   │   ├─ index.jsx
 │   │   └─ main.jsx
 │   ├─ package.json
 │   └─ vite.config.js
 ├─ backend/
 │   ├─ ai-model/
 │   │   └─ analyzeRegion.js
 │   ├─ server.js
 │   ├─ package.json
 │   └─ .env
 ├─ README.md
 └─ .gitignore
```

---

## Features

* **Interactive Map**: Click on any region to instantly analyze its health index.
* **AI-Powered Analysis**: Computes a health score based on multiple land indicators.
* **Region Card**: Provides detailed information and recommendations for the selected region.
* **Analytics Dashboard**: Visualizes historical health trends with interactive charts and mini-maps.
* **Responsive UI**: Built with React and Vite for a smooth and modern user experience.

---

## Tools & Technologies

* **Frontend**: React, Vite, Leaflet, Recharts
* **Backend**: Node.js, Express
* **Database**: Supabase
* **APIs**: OpenStreetMap (Reverse Geocoding)
* **AI Integration**: Custom health index model (future enhancement with Claude.ai)

---

## Deployment

TerraMind is deployed and fully functional online. You can access it here:

* **Frontend:** [https://terra-mind-dcfu.vercel.app](https://terra-mind-dcfu.vercel.app)
* **Backend:** [https://terramind1.onrender.com](https://terramind1.onrender.com)

### Frontend Deployment Steps (Vercel)

1. Connect the frontend repo to Vercel.
2. Set environment variable: `REACT_APP_BACKEND_URL=https://terramind1.onrender.com`
3. Build command: `npm run build`
4. Output directory: `build`
5. Deploy → Access via the live URL.

### Backend Deployment Steps (Render)

1. Connect backend repo to Render.
2. Set environment variables:
   - `SUPABASE_URL` → Your Supabase project URL
   - `SUPABASE_KEY` → Supabase service key or anon key
   - `PORT=5000`
3. Start command: `node server.js`
4. Deploy → Backend URL: `https://terramind1.onrender.com`

---

## Installation & Running Locally

1. Clone the repository:

```bash
git clone https://github.com/KyUCOMRADE/TerraMind.git
```

2. **Backend Setup**:

```bash
cd TerraMind/backend
npm install
cp .env.example .env
# Update .env with your Supabase credentials
node server.js
```

3. **Frontend Setup**:

```bash
cd ../frontend
npm install
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` to access the application.

---

## Future Enhancements

* Integration with real GIS/Remote Sensing data for precise analyses.
* Advanced AI recommendations using Claude.ai.
* Improved mobile responsiveness for wider accessibility.

---

## Contribution

Feel free to fork the repository, contribute improvements, or report issues. Together, we can build smarter, greener solutions for our planet.

---

**TerraMind — Coding for a Sustainable Future 🌍🌱**