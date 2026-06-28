import {createRawGPUBuffer} from './simulator.js'
import {parseGPUBuffer} from './parser.js'
import {saveTelemetry} from './telemetryRepository.js' 

async function ingestTelemetry() {
    console.log("Starting telemetry ingestion...");

    for (let nodeID = 1; nodeID <=5; nodeID++){
        const rawBuffer = createRawGPUBuffer(nodeID);
        const parsedPacket = parseGPUBuffer(rawBuffer);
        await saveTelemetry(parsedPacket);

        console.log(`saved telemetry snapshot for node cluster #${parsedPacket.nodeID}`);
    }
}

ingestTelemetry();




