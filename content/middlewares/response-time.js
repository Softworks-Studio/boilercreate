export const responseTime = `
import responseTime from 'response-time';

export function applyResponseTime(app) {
  app.use(responseTime((req, res, time) => {
    // time is in milliseconds
    
    // Round to 2 decimal places
    const roundedTime = Math.round(time * 100) / 100;
    
    // Set X-Response-Time header
    res.setHeader('X-Response-Time', roundedTime + 'ms');
    
    // Optionally log the response time
    console.log(\`\${req.method} \${req.url} - Response Time: \${roundedTime}ms\`);
  }));
}
`;
