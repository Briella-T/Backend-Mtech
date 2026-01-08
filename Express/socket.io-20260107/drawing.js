import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const http = createServer(app);
const io = new Server(http);

const port = process.env.PORT || 3000;
// users array to track all the socket connections
let users = [];

app.use('/', express.static(import.meta.dirname + '/drawingPublic'));

io.on('connection', (socket) => {
    socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
    console.log('a user connected');
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

http.listen(port, () => {
    console.log(`listening on port:${port}`);
});
