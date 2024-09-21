export const expressCacheController = `
import mcache from 'memory-cache';

export function applyCache(app) {
  // Cache middleware
  const cache = (duration) => {
    return (req, res, next) => {
      const key = '__express__' + req.originalUrl || req.url;
      const cachedBody = mcache.get(key);
      if (cachedBody) {
        res.send(cachedBody);
        return;
      } else {
        res.sendResponse = res.send;
        res.send = (body) => {
          mcache.put(key, body, duration * 1000);
          res.sendResponse(body);
        };
        next();
      }
    };
  };

  // Apply cache to specific routes
  app.use((req, res, next) => {
    // Example: Cache GET requests to /api for 5 minutes
    if (req.method === 'GET' && req.path.startsWith('/api')) {
      return cache(300)(req, res, next);
    }
    // Add more conditions for other routes as needed
    next();
  });

  // Cache clear function (optional)
  app.clearCache = (route) => {
    mcache.del('__express__' + route);
  };

//   // Example route to clear cache (for authorized users only)
//   app.post('/clear-cache', (req, res) => {
//     // Add authentication check here
//     if (req.body.route) {
//       app.clearCache(req.body.route);
//       res.send('Cache cleared for route: ' + req.body.route);
//     } else {
//       res.status(400).send('Route not specified');
//     }
//   });
}
`;
