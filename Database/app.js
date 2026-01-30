const express = require('express');
const mongoose = require('mongoose');
//const dbURL = 'mongodb://localhost:27017/mtec';
const dbURL = 'mongodb+srv://briellat029_db_user:oXgEP7AYGrF0PkJq@cluster0.fd3goyc.mongodb.net/mtech'; 

const app = express();
const port = process.env.PORT || 3050;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(dbURL);
const db = mongoose.connection;
db.on('error', (err) => {
    console.log('DB connection error:', err);
});
db.once('open', () => {
    console.log('DB connected successfully');
});

const friendSchema = new mongoose.Schema({
    name: String,
    age: Number,
    role: String,
    color: String
});

const Friend = mongoose.model('Friend', friendSchema);

app.post('/addFriend', async (req, res) => {
    const { name, age, role, color } = req.body;
    const newFriend = new Friend({ name, age, role, color });
    try {
        const savedFriend = await newFriend.save();
        res.status(201).json(savedFriend);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add friend' });
    }
})

app.get('/listFriends', async (req, res) => {
    try {
        const friends = await Friend.find();
        res.status(200).json(friends);  
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve friends' });
    } 
});

//In progress features

// app.get('/findFriend/:name', async (req, res) => {
//     const friendName = req.params.name;
//     try {
//         const friend = await Friend.findOne({ name: friendName });
//         if (friend) {
//             res.status(200).json(friend);
//         } else {
//             res.status(404).json({ error: 'Friend not found' });
//         }
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to retrieve friend' });
//     } 
// });

// app.delete('/deleteFriend/:name', async (req, res) => {
//     const friendName = req.params.name;
//     try {
//         const deletedFriend = await Friend.findOneAndDelete({ name: friendName });
//         if (deletedFriend) {
//             res.status(200).json({ message: 'Friend deleted successfully' });
//         } else {
//             res.status(404).json({ error: 'Friend not found' });
//         }
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to delete friend' });
//     } 
// });

app.update('/updateFriend/:name', async (req, res) => {
    const friendName = req.params.name;
    const updateData = req.body;
    try {
        const updatedFriend = await Friend.findOneAndUpdate({ name: friendName }, updateData, { new: true });
        if (updatedFriend) {
            res.status(200).json(updatedFriend);
        } else {
            res.status(404).json({ error: 'Friend not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to update friend' });
    } 
});

app.get('/', (req, res) => {
    res.send('Hello MTEC!');
})

app.listen(port, (err) => {
   if (err) console.log(err);
   console.log(`App Server listen on port: ${port}`);
});












//Message aug2025-classroom






