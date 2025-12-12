const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
const myOtherEmitter = new MyEmitter();

myOtherEmitter.emit('messageLogged');

myEmitter.on('messageLogged', (a, b) => {
    setImmediate(() => {
        console.log('Listener called asynchronously');
    });
});

myEmitter.on('messageLogged', (a, b) => {
    console.log('First listener called');
});

myEmitter.on('messageLogged', (a, b) => {
    console.log('Second listener called');
});

myEmitter.on('error', (a, b) => {
    console.log('Error listener called');
});
 


myEmitter.emit("messageLogged", "some", "strings");

myEmitter.emit("error");
