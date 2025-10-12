import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';


export default function Dashboard({ analyses }) {
return (
<div>
<h2>Analytics Dashboard</h2>
{analyses.length === 0 ? (
<p>No analysis data. Click on map to analyze regions.</p>
) : (
<LineChart width={600} height={300} data={analyses} style={{ marginTop: 20 }}>
<XAxis dataKey='clicked_region' />
<YAxis domain={[0, 1]} />
<Tooltip />
<CartesianGrid stroke='#ccc' />
<Line type='monotone' dataKey='health_index' stroke='#8884d8' />
</LineChart>
)}
</div>
);
}