export const methodOverride = `
import methodOverride from 'method-override';

export function applyMethodOverride(app) {
  // Override with POST having ?_method=DELETE or ?_method=PUT in the query string
  app.use(methodOverride('_method'));

  // Override with header X-HTTP-Method-Override
  app.use(methodOverride('X-HTTP-Method-Override'));

  // Override with custom function
  app.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));
}
`;
