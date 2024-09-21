export const passport = `
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { comparePassword } from './bcrypt.js'; // Assuming you have this from the bcrypt setup

// This is a mock user lookup function. Replace with actual database lookup.
async function getUserByUsername(username) {
  // In a real app, fetch this from your database
  const mockUser = {
    id: '1',
    username: 'testuser',
    hashedPassword: '$2b$10$abcdefghijklmnopqrstuvwxyz123456'
  };
  return username === mockUser.username ? mockUser : null;
}

// This is a mock user lookup function by ID. Replace with actual database lookup.
async function getUserById(id) {
  // In a real app, fetch this from your database
  const mockUser = {
    id: '1',
    username: 'testuser',
    hashedPassword: '$2b$10$abcdefghijklmnopqrstuvwxyz123456'
  };
  return id === mockUser.id ? mockUser : null;
}

export function configurePassport(app) {
  app.use(passport.initialize());

  // Local Strategy
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const isMatch = await comparePassword(password, user.hashedPassword);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // JWT Strategy
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY || 'your-secret-key'
  };

  passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await getUserById(jwtPayload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  }));

  // Serialization and Deserialization
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}

// Example usage in routes:
/*
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { configurePassport } from './services/passport.js';

const app = express();
configurePassport(app);

// Local Strategy login route
app.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Protected route using JWT Strategy
app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});
*/
`;
