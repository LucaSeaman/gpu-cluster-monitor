import {createRawGPUBuffer} from './simulator.js'
import {parseGPUBuffer} from './parser.js'
import {saveTelemetry} from './telemetryRepository.js' 
import './server.js'

async function ingestTelemetry() {
    console.log("Starting telemetry ingestion...");
    while(true){
        for (let nodeID = 1; nodeID <=500; nodeID++){
            const rawBuffer = createRawGPUBuffer(nodeID);
            const parsedPacket = parseGPUBuffer(rawBuffer);
            await saveTelemetry(parsedPacket);

            console.log(`saved telemetry snapshot for node cluster #${parsedPacket.nodeID}`);
        }
        console.log("Saved latest telemetry cluster states to PostgreSQL.");

        await new Promise(resolve=>setTimeout(resolve, 1000));
    }
        

}

ingestTelemetry();




