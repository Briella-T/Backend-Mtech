//Client.js
import net from 'node:net';
const PORT = 4000;
const HOST = '127.0.0.1';
const client = net.createConnection({ host: HOST, port: PORT }, () => {
console.log('Connected to server');
});
client.on('data', (data) => {
console.log(`Server says: ${data.toString().trim()}`);
});
client.on('end', () => {
console.log('Disconnected from server');
});
client.on('error', (err) => {
console.error(`Client error: ${err.message}`);
});
// Send a message after connection
client.write('Hello, server!\n');