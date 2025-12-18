import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello, Daniel! <br> Thank you Garrett');
});

app.get('/currenttime', (req, res) => {
    const currentTime = new Date().toLocaleString();
    res.send(`Current time is: ${currentTime}`);
});
app.get('/getClamChowder', (req, res) => {
    res.sendFile(path.join(__dirname, 'clamChowder.txt'));
});

app.post('/user',(req, res) => {
    const name = req.body.username;
    res.send('POST request received '+ name);
});

//http://localhost:3000/classTime/9am-5pm
app.get('/classTime/:from-:to', (req, res) => {
    let from = req.params.from;
    let to = req.params.to;
    let msg = `Class time is from ${from} to ${to}`;
    console.log(req.params);
    res.send(`${msg}`);
});

//http://localhost:3000/abcd
app.get('/a{b}cd', (req, res) => {
    const userId = req.params.id;
    res.send(`User ID requested: ${userId}`);
});

//http://localhost:3000/applepie/23
app.get('/{apple}pie/:count', (req, res) => {
    const count = req.params.count;
    res.send(`Pie requested: ${count} `);
});

//http://localhost:3000/simplyfly
app.get(/.*fly$/, (req, res) => {
    res.send('/.*fly$/');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});