export const serveFavicon = `
import favicon from 'serve-favicon';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function applyServeFavicon(app) {
  // Adjust the path to where your favicon is located
  const faviconPath = path.join(__dirname, '..', '..', 'public', 'favicon.ico');
  
  app.use(favicon(faviconPath, {
    maxAge: 2592000000 // Cache for 30 days (in milliseconds)
  }));
}
`;
