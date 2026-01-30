const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key';

app.use(express.json());

let users = [
  { username: 'admin', password: 'password' },
  { username: 'user', password: 'pass123' }
];

let cards = [
  { id: 1, name: 'Lightning Bolt', type: 'Spell', rarity: 'Common' },
  { id: 2, name: 'Forest Dragon', type: 'Creature', rarity: 'Rare' },
  { id: 3, name: 'Healing Potion', type: 'Artifact', rarity: 'Common' }
];

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ errorMessage: 'Token required' });
  }
  
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ errorMessage: 'Invalid token' });
  }
}


app.get('/', (req, res) => {
  res.json({ message: 'Simple Card Game API', status: 'Running' });
});

app.post('/getToken', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ errorMessage: 'Username and password required' });
  }
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ errorMessage: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ successMessage: 'Login successful', token });
});

app.get('/cards', (req, res) => {
  let result = [...cards];
  
  if (req.query.type) {
    result = result.filter(card => card.type.toLowerCase() === req.query.type.toLowerCase());
  }
  
  if (req.query.rarity) {
    result = result.filter(card => card.rarity.toLowerCase() === req.query.rarity.toLowerCase());
  }
  
  res.json({ 
    successMessage: `Found ${result.length} cards`,
    cards: result 
  });
});

app.post('/cards/create', verifyToken, (req, res) => {
  const { name, type, rarity } = req.body;
  
  if (!name || !type || !rarity) {
    return res.status(400).json({ errorMessage: 'Name, type, and rarity are required' });
  }
  
  const newCard = {
    id: cards.length + 1,
    name,
    type,
    rarity
  };
  
  cards.push(newCard);
  res.status(201).json({ 
    successMessage: 'Card created successfully',
    card: newCard 
  });
});

app.put('/cards/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const cardIndex = cards.findIndex(card => card.id === id);
  
  if (cardIndex === -1) {
    return res.status(404).json({ errorMessage: 'Card not found' });
  }
  
  const { name, type, rarity } = req.body;
  
  if (name) cards[cardIndex].name = name;
  if (type) cards[cardIndex].type = type;
  if (rarity) cards[cardIndex].rarity = rarity;
  
  res.json({ 
    successMessage: 'Card updated successfully',
    card: cards[cardIndex] 
  });
});

app.delete('/cards/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const cardIndex = cards.findIndex(card => card.id === id);
  
  if (cardIndex === -1) {
    return res.status(404).json({ errorMessage: 'Card not found' });
  }
  
  const deletedCard = cards.splice(cardIndex, 1)[0];
  
  res.json({ 
    successMessage: 'Card deleted successfully',
    card: deletedCard 
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ errorMessage: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ errorMessage: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple Card API running on http://localhost:${PORT}`);
  console.log(`📋 Endpoints:`);
  console.log(`   POST /getToken - Get auth token`);
  console.log(`   GET /cards - Get all cards`);
  console.log(`   POST /cards/create - Create card (requires token)`);
  console.log(`   PUT /cards/:id - Update card (requires token)`);
  console.log(`   DELETE /cards/:id - Delete card (requires token)`);
});

module.exports = app;
