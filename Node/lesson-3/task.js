const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

Tasks = [];

console.log("Enter tasks (type 'done' to finish): ");

rl.on('line', (answer) => {
    if (answer.toLowerCase() === 'done') {
        console.log('Exiting task input.');
        console.log(`Your tasks: ${Tasks.join(', ')}`);
        rl.close();
        return;
    }
    Tasks.push(answer);
    console.log(`Task added: ${answer}`);
});

// rl.on('line', (answer) => {
//     if (answer.toLowerCase() === 'done') {
//         console.log('Exiting task input.');
//         console.log(`Your tasks: ${Tasks.join(', ')}`);
//         rl.close();
//         return;
//     }
// })

// rl.on('line', (answer) => {
//     console.log("Enter tasks (type 'done' to finish): ");

//     console.log(`You entered: ${answer}`);
//     if (answer.toLowerCase() === 'done') {
//         console.log('Exiting task input.');
//         console.log(`Your tasks: ${answer}`);
//         rl.close();
//         return;
//     }
// })

