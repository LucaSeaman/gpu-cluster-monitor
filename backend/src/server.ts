import express from 'express'
import {query} from './db.js'

const app = express();
const PORT = process.env.PORT||3000;

app.use(express.json());
app.get('/api/telemetry', async (req,res)=> {
    try{
        const result = await query(`
           SELECT DISTINCT ON (node_id) id, node_id, workload_type, temperature, fan_speed, power_draw, recorded_at
           FROM gpu_telemetry
           ORDER BY node_id, recorded_at DESC; 
        `);
        res.json(result.rows);

    } catch (error){
        console.error('Error fetching telemetry:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.listen(PORT, ()=>{
    console.log(`API Server running on http://localhost:${PORT}`);
});