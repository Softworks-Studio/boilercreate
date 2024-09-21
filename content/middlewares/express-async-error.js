export const expressAsyncErrors = `
import 'express-async-errors';

export function applyExpressAsyncErrors(app) {
  // No need to explicitly use this middleware
  // Just importing it extends Express to handle async errors

  // Add a custom error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  // Optionally, you can add more specific error handlers here
  // For example:
  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('Invalid token');
    } else {
      next(err);
    }
  });
}
`;
