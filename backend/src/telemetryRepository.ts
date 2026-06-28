import {query} from './db.js'
import {GPUPacket} from './simulator.js'

export async function saveTelemetry(packet: GPUPacket): Promise<void> {
    const sql = `
        INSERT INTO gpu_telemetry (node_id, workload_type, temperature, fan_speed, power_draw)
        VALUES ($1, $2, $3, $4, $5);
    `;
    const values = [
        packet.nodeID,
        packet.workloadType,
        packet.temperature, 
        packet.fanSpeed,
        packet.powerDraw
    ];
    try {
        await query(sql, values);
    } catch (error){
        console.log(`Failed to save telemetry for node ${packet.nodeID}:`, error);
    }
}