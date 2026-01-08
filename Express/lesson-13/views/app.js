const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, 
  (accessToken, rrefreshToekn, profile, done) => {
    done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const authRouter = express.Router();
app.use('/auth', authRouter);

authRouter.get('/auth/google', passport.authenticate('google', 
    {scope: ['email', 'profile']})
);

authRouter.get('/auth/google', passport.authenticate('google', 
    {successRedirect: '/displayUserDetails', failureRedirect: '/'})
);

app.get("/", (req, res) => {
  res.render('index');
});

app.get("/displayUserDetails", (req, res) => {
  if (req.isAuthenticated()) {
    res.render('displayUserDetails', { user: req.user });
  } else {
    res.redirect('/');
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

