class Shape {
    constructor(name) {
        this.name = name;
    }

    describe() {
        console.log(`This is a shape named ${this.name}`);
    }

    getType() {
        return 'Shape';
    }
}

const shape = new Shape('MyShape');
shape.describe(); 
console.log("Type", shape.getType());

class Rectangle extends Shape {
    constructor(width, height) {
        super('Rectangle');
        this.width = width;
        this.height = height;
    }
    getArea() {
        return this.width * this.height;
    }

    getType() {
        return 'Rectangle';
    }
}

const rectangle = new Rectangle(5, 10);
rectangle.describe(); 
console.log("Type", rectangle.getType());
console.log("Area", rectangle.getArea());

class Square extends Rectangle {
}
const square = new Square();

console.log(`square instanceof Square ${square instanceof Square}`);
console.log(`square instanceof Rectangle ${square instanceof Rectangle}`);
console.log(`square instanceof Shape ${square instanceof Shape}`);