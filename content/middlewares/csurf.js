export const csurf = `
import csrf from 'csurf';

export function applyCsrf(app) {
  const csrfProtection = csrf({
    cookie: true,
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
    value: (req) => {
      return req.body._csrf || req.query._csrf || req.headers['x-csrf-token'];
    }
  });

  // Apply CSRF protection to all routes
  app.use(csrfProtection);

  // Error handler for CSRF token errors
  app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    
    // Handle CSRF token errors here
    res.status(403).json({ message: 'Invalid or missing CSRF token' });
  });

  // Middleware to set CSRF token in res.locals for use in views
  app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
  });
}
`;
