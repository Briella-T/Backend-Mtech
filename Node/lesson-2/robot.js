const EventEmitter = require('events');

class Robot extends EventEmitter {
    constructor(name) {
        super();
        this.name = name;
        this.isActive = false;
        this.addListeners();

    }
    addListeners() {
        this.once('activate', this.activateListener);
        this.on('speak',  this.speakListener );
        this.on('error', this.errorListener);
    }
    activateListener() {
            console.log(`${this.name} is now active.`);
            this.isActive = true;
        }
    speakListener(quote) {
            if (this.isActive) {
                console.log(`${this.name}: ${quote}`);
            } else {
                console.log(`${this.name} is inactive and cannot speak.`);
            }
    }
    errorListener() {
            console.log(`${this.name} has encountered an error!`);
    }
}

const R2D2 = new Robot('R2-D2');
const C3PO = new Robot('C-3PO');

R2D2.emit('speak', 'Beep Boop');
R2D2.emit('activate');
R2D2.emit('speak', 'Beep Beep');
R2D2.emit('activate');
R2D2.emit('error');

C3PO.emit('speak', 'Beep Boop');
C3PO.emit('activate');
C3PO.emit('speak', 'Hello');
C3PO.emit('activate');
C3PO.emit('error');
