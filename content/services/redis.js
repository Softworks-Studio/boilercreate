export const redis = `
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export async function initializeRedis() {
  await redisClient.connect();
}

export async function closeRedis() {
  await redisClient.quit();
}

// Basic set operation
export async function setKey(key, value, expirationInSeconds = 3600) {
  await redisClient.set(key, JSON.stringify(value), {
    EX: expirationInSeconds
  });
}

// Basic get operation
export async function getKey(key) {
  const value = await redisClient.get(key);
  return value ? JSON.parse(value) : null;
}

// Delete a key
export async function deleteKey(key) {
  await redisClient.del(key);
}

// Increment a counter
export async function incrementCounter(key) {
  return await redisClient.incr(key);
}

// Set a hash
export async function setHash(key, field, value) {
  await redisClient.hSet(key, field, JSON.stringify(value));
}

// Get a hash field
export async function getHashField(key, field) {
  const value = await redisClient.hGet(key, field);
  return value ? JSON.parse(value) : null;
}

// Example of using Redis for caching
export async function cachedOperation(key, operation, expirationInSeconds = 3600) {
  const cachedResult = await getKey(key);
  if (cachedResult) {
    return cachedResult;
  }

  const result = await operation();
  await setKey(key, result, expirationInSeconds);
  return result;
}

// Example usage:
/*
import express from 'express';
import { initializeRedis, closeRedis, cachedOperation } from './services/redis.js';

const app = express();

// Initialize Redis when your app starts
initializeRedis().then(() => {
  console.log('Redis connected');
}).catch((err) => {
  console.error('Redis connection error:', err);
});

// Example route using Redis for caching
app.get('/cached-data', async (req, res) => {
  try {
    const data = await cachedOperation('cached-data-key', async () => {
      // This is your expensive operation that you want to cache
      return { message: 'This data is cached', timestamp: new Date() };
    }, 60); // Cache for 60 seconds
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Close Redis connection when your app shuts down
process.on('SIGINT', async () => {
  await closeRedis();
  process.exit(0);
});
*/
`;
