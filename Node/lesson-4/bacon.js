const fs = require('fs');

const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('Usage: node bacon.js <fileToRead> <fileToWrite>');
    process.exit(1);
}

const fileToRead = args[0];
const fileToWrite = args[1];

try {
    const content = fs.readFileSync(fileToRead, 'utf8');
    
    const baconRegex = /\bbacon\b/gi;
    const matches = content.match(baconRegex);
    const baconCount = matches ? matches.length : 0;
    
    const modifiedContent = content.replace(baconRegex, 'tasty');
    
    fs.writeFileSync(fileToWrite, modifiedContent, 'utf8');
    
    console.log(baconCount);
    
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}

