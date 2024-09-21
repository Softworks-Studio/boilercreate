export const expressSlowDown = `
import slowDown from 'express-slow-down';

export function applySlowDown(app) {
  const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 100, // allow 100 requests per 15 minutes, then...
    delayMs: 500, // begin adding 500ms of delay per request above 100
    maxDelayMs: 20000, // max delay of 20 seconds
    skipFailedRequests: false, // count failed requests (status >= 400)
    skipSuccessfulRequests: false, // count successful requests (status < 400)
    headers: true, // Send custom rate limit header with limit and remaining
    keyGenerator: (req) => {
      return req.ip; // Use IP address as the key
    },
    skip: (req) => {
      // Optional: skip slowing down certain requests
      return req.ip === '127.0.0.1'; // Example: don't slow down localhost
    }
  });

  // Apply speed limiter to all requests
  app.use(speedLimiter);
}
`;
