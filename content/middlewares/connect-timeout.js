export const connectTimeout = `
import timeout from 'connect-timeout';

export function applyTimeout(app, timeoutDuration = '15s') {
  // Apply timeout middleware to all routes
  app.use(timeout(timeoutDuration));

  // Add a custom timeout handler
  app.use((req, res, next) => {
    if (!req.timedout) return next();

    // Handle timeout error
    res.status(503).send('Request timeout. Please try again later.');
  });

  // Timeout error handler
  app.use((err, req, res, next) => {
    if (err.timeout) {
      console.error('Request timed out:', req.url);
      res.status(503).send('Request timeout. Please try again later.');
    } else {
      next(err);
    }
  });

  // Haltable middleware to clear the timeout
  app.use((req, res, next) => {
    if (!req.timedout) {
      // Clear the timeout for successful responses
      req.clearTimeout();
    }
    next();
  });
}
`;
