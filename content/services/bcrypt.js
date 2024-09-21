export const bcrypt = `
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // You can adjust this value based on your security needs

/**
 * Hash a password
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} - The hashed password
 */
export async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - The plain text password to compare
 * @param {string} hashedPassword - The hashed password to compare against
 * @returns {Promise<boolean>} - True if the passwords match, false otherwise
 */
export async function comparePassword(password, hashedPassword) {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
}

// Example usage:
/*
import { hashPassword, comparePassword } from './services/bcrypt.js';

// When registering a new user
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    // Save the username and hashedPassword to your database
    // ...
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// When logging in a user
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Retrieve the hashedPassword for this username from your database
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const passwordMatch = await comparePassword(password, user.hashedPassword);
    if (passwordMatch) {
      // Passwords match, proceed with login
      res.json({ message: 'Login successful' });
    } else {
      // Passwords don't match
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});
*/
`;
