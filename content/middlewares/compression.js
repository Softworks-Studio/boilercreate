export const compression = `
import compression from 'compression';

export function applyCompression(app) {
  app.use(compression({
    level: 6, // Default compression level
    threshold: 100 * 1024, // Only compress responses larger than 100KB
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        // Don't compress responses with this request header
        return false;
      }
      // Compress for all HTTP methods
      return compression.filter(req, res);
    }
  }));
}
`;
