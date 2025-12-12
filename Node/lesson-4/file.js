const fs = require('fs');

fs.readdir("./", (err, fileNames) => {
    if (err) {
        console.error("Error reading directory:", err);
        return;
    }
    console.log("Files in current directory:");
    fileNames.forEach(fileName => {
        console.log(fileName);
    });
})