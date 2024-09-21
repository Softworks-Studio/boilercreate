export const expressHealthcheck = `
import healthCheck from 'express-healthcheck';

export function applyHealthCheck(app, options = {}) {
  const defaultOptions = {
    path: '/health',
    healthy: () => ({ status: 'UP' }),
    test: {
      // Add custom health checks here
      customCheck: () => Promise.resolve()
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  app.use(mergedOptions.path, healthCheck(mergedOptions));

  // Optional: Add a more detailed health check route
  app.get('/healthz', async (req, res) => {
    try {
      const healthStatus = {
        status: 'UP',
        timestamp: new Date().toISOString(),
        services: {}
      };

      // Example: Check database connection
      // Uncomment and modify as needed
      /*
      try {
        await db.authenticate();
        healthStatus.services.database = 'UP';
      } catch (error) {
        healthStatus.services.database = 'DOWN';
        healthStatus.status = 'DOWN';
      }
      */

      // Example: Check external API
      // Uncomment and modify as needed
      /*
      try {
        const response = await fetch('https://api.example.com/status');
        if (response.ok) {
          healthStatus.services.externalApi = 'UP';
        } else {
          throw new Error('API response not OK');
        }
      } catch (error) {
        healthStatus.services.externalApi = 'DOWN';
        healthStatus.status = 'DOWN';
      }
      */

      res.json(healthStatus);
    } catch (error) {
      res.status(500).json({ status: 'DOWN', error: error.message });
    }
  });
}
`;
