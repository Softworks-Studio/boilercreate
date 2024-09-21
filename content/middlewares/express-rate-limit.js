export const expressRateLimit = `
import rateLimit from 'express-rate-limit';

export function applyRateLimit(app) {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
    legacyHeaders: false, // Disable the 'X-RateLimit-*' headers
    message: 'Too many requests from this IP, please try again later.',
    skip: (req) => {
      // Optionally skip limiting for certain routes or conditions
      return req.ip === '127.0.0.1'; // Example: skip for localhost
    }
  });

  // Apply rate limiting to all requests
  app.use(limiter);
}
`;
