const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("What's your favorite color? ", (answer) => {
    console.log(`Cool! ${answer} is a great color.`);
    rl.close();
});