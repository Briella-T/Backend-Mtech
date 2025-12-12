import fs from 'fs';
import csv from 'csv-parser';

const results = [];

fs.createReadStream('data/input.csv')
.pipe(csv())
.on('data', (row) => results.push(row))
.on('end', () => {
    console.log('CSV parsed: ', results);
    skipAdults(results, 20);
});

function skipAdults (data, age) {
    const notAdults = [];
    data.forEach (person => {
        if (person.age < age) {
            notAdults.push(person);
        }
    });
    console.log('Transformed Data: ', notAdults);
}