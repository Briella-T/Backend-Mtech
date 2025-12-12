import net from 'node:net';
const PORT = 4000;
// Simple TCP server that echoes back received data
const server = net.createServer((client) => {
console.log(`Client connected: ${client.remoteAddress}:${client.remotePort}`);
client.on('data', (chunk) => {
const msg = chunk.toString().trim();
client.write(`Echo: ${msg}\n`);
});
client.on('end', () => {
console.log(`Client disconnected: ${client.remoteAddress}:${client.remotePort}`);
});
client.on('error', (err) => {
console.error(`Client error: ${err.message}`);
});
});
server.on('error', (err) => {
console.error(`Server error: ${err.message}`);
});
server.listen(PORT, () => {
console.log(`TCP Echo Server listening on port ${PORT}`);
});