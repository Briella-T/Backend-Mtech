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

function handleWhisperCommand(senderClient, message) {
    const parts = message.split(' ');
    const senderId = senderClient.clientId;
    
    if (parts.length < 3) {
        senderClient.write('Error: Whisper command format is "/w <username> <message>"\n');
        return;
    }
    
    const targetUsername = parts[1];
    const whisperMessage = parts.slice(2).join(' ');
    
    if (targetUsername === senderId) {
        senderClient.write('Error: You cannot whisper to yourself\n');
        return;
    }
    
    const targetClient = clients.find(client => client.clientId === targetUsername);
    
    if (!targetClient) {
        senderClient.write(`Error: User "${targetUsername}" not found\n`);
        return;
    }
    
    if (targetClient.destroyed) {
        senderClient.write(`Error: User "${targetUsername}" is no longer connected\n`);
        return;
    }
    
    targetClient.write(`[Whisper from ${senderId}]: ${whisperMessage}\n`);
    
    senderClient.write(`[Whisper sent to ${targetUsername}]: ${whisperMessage}\n`);
    
    logToFile(`${senderId} whispered to ${targetUsername}: ${whisperMessage}`);
}

function handleUsernameCommand(client, message) {
    const parts = message.split(' ');
    if (parts.length !== 2) {
        client.write('Error: Username command format is "/username <new_username>"\n');
        return;
    }
    
    const newUsername = parts[1];
    const oldUsername = client.clientId;
    
    if (!/^[a-zA-Z0-9_-]+$/.test(newUsername)) {
        client.write('Error: Username can only contain letters, numbers, underscores, and hyphens\n');
        return;
    }
    
    if (clients.some(c => c.clientId === newUsername && c !== client)) {
        client.write(`Error: Username "${newUsername}" is already taken\n`);
        return;
    }
    
    client.clientId = newUsername;
    client.write(`Username changed to "${newUsername}"\n`);
    
    clients.forEach((otherClient) => {
        if (otherClient !== client && !otherClient.destroyed) {
            otherClient.write(`${oldUsername} has changed their username to ${newUsername}\n`);
        }
    });
    
    logToFile(`${oldUsername} changed username to ${newUsername}`);
}

function handleQuitCommand(client) {
    client.end();
}

function handleKickCommand(adminClient, message) {
    const parts = message.split(' ');
    if (parts.length !== 2) {
        adminClient.write('Error: Kick command format is "/kick <username>"\n');
        return;
    }
    
    const targetUsername = parts[1];
    
    const targetClient = clients.find(client => client.clientId === targetUsername);
    
    if (!targetClient) {
        adminClient.write(`Error: User "${targetUsername}" not found\n`);
        return;
    }
    
    if (targetClient.destroyed) {
        adminClient.write(`Error: User "${targetUsername}" is no longer connected\n`);
        return;
    }
    
    targetClient.end('You have been kicked from the chat by an admin.\n');
    
    adminClient.write(`User "${targetUsername}" has been kicked from the chat.\n`);
    
    logToFile(`Admin ${adminClient.clientId} kicked ${targetUsername} from the chat`);
}

function handleClientList(client) {
    const clientList = clients
        .filter(c => !c.destroyed)
        .map(c => c.clientId)
        .join(', ');
    client.write(`Connected clients: ${clientList}\n`);
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
        
        if (message.startsWith('/w ')) {
            handleWhisperCommand(client, message);
        } else if (message.startsWith('/username ')) {
            handleUsernameCommand(client, message);
        } else if (message === '/quit') {
            handleQuitCommand(client);
        } else if (message.startsWith('/kick ')) {
            handleKickCommand(client, message);
        } else if (message === '/list') {
            handleClientList(client);
        } else {
            clients.forEach((otherClient) => {
                if (otherClient !== client && !otherClient.destroyed) {
                    otherClient.write(`${client.clientId}: ${message}\n`);
                }
            });
            
            logToFile(`${client.clientId}: ${message}`);
        }
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