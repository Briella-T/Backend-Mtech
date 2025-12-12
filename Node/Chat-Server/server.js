const net = require('net');
const fs = require('fs');
const path = require('path');

const clients = [];
let clientIdCounter = 1;

function logToFile(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFile(path.join(__dirname, 'chat.log'), logMessage, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

const server = net.createServer((client) => {
    const clientId = `Client${clientIdCounter++}`;
    client.clientId = clientId;
    
    console.log(`${clientId} connected`);
    clients.push(client);
    
    client.write(`Welcome to the chat room! You are ${clientId}\n`);
    
    clients.forEach((otherClient) => {
        if (otherClient !== client && !otherClient.destroyed) {
            otherClient.write(`${clientId} has joined the chat\n`);
        }
    });
    
    logToFile(`${clientId} connected`);
    
    client.on('data', (data) => {
        const message = data.toString().trim();
        console.log(`Received from ${clientId}: ${message}`);
        
        clients.forEach((otherClient) => {
            if (otherClient !== client && !otherClient.destroyed) {
                otherClient.write(`${clientId}: ${message}\n`);
            }
        });
        
        logToFile(`${clientId}: ${message}`);
    });
    
    client.on('close', () => {
        console.log(`${clientId} disconnected`);
        const index = clients.indexOf(client);
        if (index !== -1) {
            clients.splice(index, 1);
        }
        
        clients.forEach((otherClient) => {
            if (!otherClient.destroyed) {
                otherClient.write(`${clientId} has left the chat\n`);
            }
        });
        
        logToFile(`${clientId} disconnected`);
    });
    
    client.on('error', (err) => {
        console.error(`${clientId} error: ${err.message}`);
        const index = clients.indexOf(client);
        if (index !== -1) {
            clients.splice(index, 1);
        }
        
        logToFile(`${clientId} error: ${err.message}`);
    });
    
}).listen(3001, () => {
    console.log('Server listening on port 3001');
});

server.on('error', (err) => {
    console.error('Server error:', err.message);
    logToFile(`Server error: ${err.message}`);
});