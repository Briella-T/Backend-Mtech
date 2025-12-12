const readline = require('node:readline');
import fs from 'fs';
import csv from 'csv-parser';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

fs.createReadStream('data/languages.csv')
.pipe(csv())
.on('data', (row) => languageData.push(row))
.on('end', () => {
    console.log('CSV file successfully processed.');
    askForLanguage();
});

function askForLanguage () {
    rl.question('Enter a language to search for: ', (language) => {
        const results = findPeopleByLanguage(language);
        if (results.length > 0) {
            console.log(`People who speak ${language}:`);
            results.forEach(person => {
                console.log(`- ${person.name} (${person.language})`);
            });
        } else {
            console.log(`No matches found for language: ${language}`);
        }
        rl.close();
    });
}




