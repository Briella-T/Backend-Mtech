const { argv } = require('node:process');

argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
  if (index === 2) {
      if (val === 'even') {
          even();
      } else if (val === 'odd') {
          odd();
      }
  }
});

function even() {
    num = 1;
    for (let i = 2; i <= 20; i += 2) {
        console.log(num + ": Counting: " + i);
        num++;
    }
}

function odd() {
    num = 1;
    for (let i = 1; i <= 20; i += 2) {
        console.log(num + ": Counting: " + i);
        num++;
    }
}