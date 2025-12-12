// const Fruit = ["apple", "banana", "orange", "kiwi"];

// const args = Fruit.slice(2);
// console.log(args);

// const args = process.argv.slice(2);

// if (args.length > 0) {
//     console.log(`Hello, ${args[0]}!`);
// }

const {argv} = require('node:process');

const args = argv.slice(2);// Get cli arguments (extracting from index 2 onwards)
const mode = args[0]; // 'odd' or 'even'

if (!mode || mode !== 'odd' && mode !== 'even') {
console.error('Usage: node evenOrOdd.js <odd|even>');
process.exit(1);
}

let max = 5;

switch (mode) {
case 'odd':
for (let i = 0; i < max; i++) {
    console.log((i+1) + ': counting: ' + (1 + i * 2));
}
break;
case 'even':
for (let i = 0; i < max; i++) {
    console.log((i+1) + ': counting: ' + (2 + i * 2));
}
break;
default:
console.error('Invalid mode. Use "odd" or "even".');
process.exit(1);
}