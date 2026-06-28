/// <reference types="node" />

export interface GPUPacket {
    nodeID: number;
    workloadType: number;
    temperature: number;
    fanSpeed: number;
    powerDraw: number;
}

export function createRawGPUBuffer (nodeID: number):  Buffer{
    const buffer = Buffer.alloc(7);

    const workloadType = Math.floor(Math.random()*3); 
    const isHeavyWorkload = workloadType>0;

    const temperature = isHeavyWorkload?Math.floor(Math.random()*25)+65 : Math.floor(Math.random()*15)+35;
    const fanSpeed = isHeavyWorkload?Math.floor(Math.random()*30)+70 : Math.floor(Math.random()*20)+30;
    const powerDraw = workloadType === 1 ? Math.floor(Math.random()*300)+100 : workloadType === 2?(Math.floor(Math.random()*100)+220) : 50;


    buffer.writeUInt16BE (nodeID, 0);
    buffer.writeUInt8 (workloadType, 2);
    buffer.writeUInt8 (temperature, 3);
    buffer.writeUInt8 (fanSpeed, 4);
    buffer.writeUInt16BE (powerDraw, 5);
    return buffer;
}

export function generateClusterTelemetry(nodeCount: number=500): Buffer[] {
    const stream: Buffer[] = [];
    for (let i = 1; i<=nodeCount; i++){
        stream.push(createRawGPUBuffer(i));
    }
    return stream;
}
