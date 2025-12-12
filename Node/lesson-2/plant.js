const EventEmitter = require('events');

class Plant extends EventEmitter {
    constructor() {
        super();
        this.size = 0;
        this.isPlanted = false;
        this.addListeners();
    }
    addListeners() {
        this.once('plant', this.plantListener);
        this.on('water', this.waterListener);
        this.on('bug', this.bugListener);
        this.on('harvest', this.harvestListener);
        this.on('error', this.errorListener);
    }
    plantListener() {
        console.log(`The plant has been planted.`);
        this.isPlanted = true;
        this.size = 1;
    }
    waterListener(amount) {
        if (this.isPlanted) {
            this.size += amount;
            console.log(`The plant has been watered and increased size by ${amount}. Current size: ${this.size}`);
        } else {
            console.log(`The plant is not planted yet and cannot grow.`);
        }
    }
    bugListener() {
        if (this.isPlanted) {
            this.size = Math.max(0, this.size - 1);
            console.log(`Bugs have attacked the plant! Size reduced by 1. Current size: ${this.size}`);
        } else {
            console.log(`The plant is not planted yet and cannot be attacked by bugs.`);
        }
    }
    harvestListener() {
        if (this.isPlanted && this.size > 0) {
            console.log(`The plant has been harvested. Final size was: ${this.size}`);
            this.size = 0;
            this.isPlanted = false;
        } else if (!this.isPlanted) {
            console.log(`The plant is not planted yet and cannot be harvested.`);
        } else {
            console.log(`The plant has no size to harvest.`);
        }
    }
    errorListener() {
        console.log(`The plant has encountered an error!`);
    }
}

const myplant = new Plant();

console.log("Starting plant simulation...");
console.log("Available events: ");
console.log(" - plant");
console.log(" - water (amount)");
console.log(" - bug");
console.log(" - harvest");
console.log(" - error");
console.log("-----------------------");

myplant.emit('water', 3);
myplant.emit('plant');
myplant.emit('water', 5);
myplant.emit('bug');
myplant.emit('water', 2);
myplant.emit('error');
myplant.emit('harvest');
myplant.emit('harvest');