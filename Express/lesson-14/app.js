const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected ' + socket.id);
    
  socket.on('disconnect', () => { 
    console.log('User disconnected ' + socket.id);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000' );
});