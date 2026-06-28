import {generateClusterTelemetry} from './simulator.js'
import {parseGPUParser} from './parser.js'

//logging

console.log('Starting telemetry stream....');

const rawPackets = generateClusterTelemetry(500);
console.log('Generated ${rawPackets.length} binary packets');

const sampleParsedData = parseGPUParser(rawPackets[0]);
console.log('\nSample node 1 parsed data:', sampleParsedData);

const parsedFleet = rawPackets.map(parseGPUParser);
const totalPower = parsedFleet.reduce((sum, node) => sum + node.powerDraw, 0);
const avgDraw = totalPower/parsedFleet.length;
console.log('\nFleet-wide average power draw: ${avgDraw.to.Fixed(2)}');


