# TerraMind 🌱

**AI-Powered Land Monitoring and Analytics**

---

## Overview

TerraMind is a cutting-edge full-stack web application designed to analyze and visualize land health metrics using AI-driven insights. It empowers users to assess land conditions, receive actionable recommendations, and monitor land health trends over time.

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
