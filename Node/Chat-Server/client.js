const net = require('net');
const readline = require('readline');

const client = net.createConnection(3001, () => {
    console.log('connected');
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

client.on('data', (data) => {
    console.log(data.toString());
});

client.on('close', () => {
    console.log('Disconnected from server');
    rl.close();
    process.exit(0);
});

client.on('error', (err) => {
    console.error('Connection error:', err.message);
    rl.close();
    process.exit(1);
});

rl.on('line', (input) => {
    if (input.trim().toLowerCase() === 'quit') {
        client.end();
        return;
    }
    
    if (input.trim()) {
        client.write(input);
    }
});

client.setEncoding('utf8');

console.log('Type your messages (type "quit" to exit):');