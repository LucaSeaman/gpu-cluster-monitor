import express from 'express'
import cors from 'cors'
import {query} from './db.js'

const app = express();
const PORT = process.env.PORT||3000;

app.use(cors());
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

app.get('/api/analytics', async (req, res)=> {
  try{
    const result = await query(`
      WITH latest_snapshots AS (
        SELECT DISTINCT ON (node_id) temperature, power_draw
        FROM gpu_telemetry
        ORDER BY node_id, recorded_at DESC
      )
      SELECT 
        ROUND(AVG(temperature), 1) as avg_temperature,
        ROUND(SUM(power_draw), 1) as total_power_draw,
        COUNT(*) as active_nodes
      FROM latest_snapshots;
    `);
    res.json(result.rows[0]);

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

app.get('/api/distribution', async (req, res) => {
  try {
    const result = await query(`
      WITH latest_snapshots AS (
        SELECT DISTINCT ON (node_id) workload_type
        FROM gpu_telemetry
        ORDER BY node_id, recorded_at DESC
      )
      SELECT workload_type, COUNT(*) as count
      FROM latest_snapshots
      GROUP BY workload_type
      ORDER BY workload_type;
    `);
    res.json(result.rows);

  } catch (error) {
    console.error('Error fetching workload distribution:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

app.get('/api/alerts', async (req, res) => {
  try {
    const result = await query(`
      WITH latest_snapshots AS (
        SELECT DISTINCT ON (node_id) node_id, temperature, workload_type, recorded_at
        FROM gpu_telemetry
        ORDER BY node_id, recorded_at DESC
      )
      SELECT node_id, temperature, workload_type, recorded_at
      FROM latest_snapshots
      WHERE temperature > 85.0
      ORDER BY temperature DESC;
    `);
    res.json(result.rows);

  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

app.listen(PORT, ()=>{
    console.log(`API Server running on http://localhost:${PORT}`);
});