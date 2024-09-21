export const cookieParser = `
import cookieParser from 'cookie-parser';

export function applyCookieParser(app) {
  app.use(cookieParser(process.env.COOKIE_SECRET || 'your-secret-key'));
}
`;
