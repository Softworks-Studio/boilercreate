export const jsonwebtoken = `
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';
const TOKEN_EXPIRY = process.env.JWT_EXPIRY || '1h';

/**
 * Generate a JWT token
 * @param {Object} payload - Data to be encoded in the token
 * @returns {string} - JWT token
 */
export function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

/**
 * Middleware to authenticate JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401);

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
}

// Example usage in routes:
/*
import express from 'express';
import { generateToken, authenticateToken } from './services/jsonwebtoken.js';

const app = express();

app.post('/login', (req, res) => {
  // Authenticate user (not shown here)
  const user = { id: 123, username: 'example' };
  
  const token = generateToken(user);
  res.json({ token });
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});
*/

// Refresh token functionality (optional)
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY || 'your-refresh-secret-key';
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

export function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_SECRET_KEY);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}

// Example refresh token route:
/*
app.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const user = verifyRefreshToken(refreshToken);
    const newAccessToken = generateToken({ id: user.id, username: user.username });
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.sendStatus(403);
  }
});
*/
`;
