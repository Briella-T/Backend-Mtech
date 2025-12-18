import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const port = process.env.PORT || 4000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/subscribe', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    res.send(`Thank you, ${name}, for subscribing with the email: ${email}`);
});

app.get('/file', (req, res) => {
    fs.readFile('recipe.html', 'utf8', (err, data) => {
        res.send(data);
    });
});

app.get('/time', (req, res) => {
    const currentTime = new Date().toLocaleTimeString();
    res.send(`Current server time is: ${currentTime}`);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

