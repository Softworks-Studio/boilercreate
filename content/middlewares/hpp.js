export const hpp = `
import hpp from 'hpp';

export function applyHpp(app) {
  app.use(hpp({
    whitelist: [
      // Add any parameters that you want to allow duplicates for
      // For example: 'filter', 'sort'
    ]
  }));
}
`;
