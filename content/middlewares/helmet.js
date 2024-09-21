export const helmet = `
import helmet from "helmet";

export const applyHelmet = (app) => {
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", 'data:', 'https:'],
                },
            },
            referrerPolicy: {
                policy: 'strict-origin-when-cross-origin',
            },
            hsts: {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true,
            },
        })
    );
};
`;
