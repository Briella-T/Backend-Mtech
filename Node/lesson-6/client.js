const net = require('net');

const client = net.createConnection(5000, () => {
    console.log('connected');
});

client.on('data', (data) => {
    console.log(data);
});

client.setEncoding('utf8');

//nodemon client.js