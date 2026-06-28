import {GPUPacket} from './simulator'

export function parseGPUParser(buffer : Buffer): GPUPacket {
    if (buffer.length!= 7){
        throw new Error ('Invalid packet size: Expected 7 bytes, received ${buffer.length}');
    }

    const nodeID = buffer.readUint16BE(0);
    const workloadType = buffer.readUInt8(2);
    const temperature = buffer.readUInt8(3);
    const fanSpeed  = buffer.readUInt8(4);
    const powerDraw = buffer.readUint16BE(5);
    
    return { nodeID, workloadType, temperature, fanSpeed, powerDraw };
}