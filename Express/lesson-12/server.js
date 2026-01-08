import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory user store. Production apps should use a database.
const users = [
  { id: '1', username: 'demo', passwordHash: bcrypt.hashSync('demo123', 10), displayName: 'Demo User' }
];

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = users.find((u) => u.username === username);
    if (!user) {
      return done(null, false, { message: 'Invalid username or password' });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return done(null, false, { message: 'Invalid username or password' });
    }
    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((u) => u.id === id);
  done(null, user || false);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'change-this-secret',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

app.post('/register', async (req, res) => {
  const { username, password, displayName } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const existing = users.find((u) => u.username === username);
  if (existing) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: (users.length + 1).toString(),
    username,
    passwordHash,
    displayName: displayName || username
  };
  users.push(user);
  req.login(user, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Registration succeeded but login failed' });
    }
    return res.json({ id: user.id, username: user.username, displayName: user.displayName });
  });
});

app.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    console.log(`${username}, ${password}`);
    
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || 'Login failed' });
    req.logIn(user, (errLogin) => {
      if (errLogin) return next(errLogin);
      return res.json({ id: user.id, username: user.username, displayName: user.displayName });
    });
  })(req, res, next);
});

app.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'Logged out' });
  });
});

app.get('/api/users', ensureAuthenticated, (req, res) => {
  const safeUsers = users.map(({ passwordHash, ...rest }) => rest);
  res.json(safeUsers);
});

app.get('/api/me', (req, res) => {
  if(!req.user) return res.json(null);
  const { id, username, displayName } = req.user;
  return res.json({ id, username, displayName });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});









