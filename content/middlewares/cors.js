export const cors = `
import cors from "cors";

export function applyCors(app, options = {}) {
  const corsOptions = {
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these methods
    preflightContinue: false, // Continue with the request after OPTIONS
    optionsSuccessStatus: 204, // Status code to use for successful OPTIONS request
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    maxAge: 1728000, // Preflight max age
    ...options, // Merge user-provided options
  };
  app.use(cors(corsOptions));
}


`;
