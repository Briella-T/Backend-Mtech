const { argv } = require('node:process');
console.log(argv[0]);
console.log(argv[1]);

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});