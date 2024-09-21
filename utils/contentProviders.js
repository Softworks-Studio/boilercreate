import { cors } from "../content/middlewares/cors.js";
import { helmet } from "../content/middlewares/helmet.js";
import { morgan } from "../content/middlewares/morgan.js";
import { expressValidator } from "../content/middlewares/express-validator.js";
import { expressSession } from "../content/middlewares/express-session.js";
import { cookieParser } from "../content/middlewares/cookie-parser.js";
import { compression } from "../content/middlewares/compression.js";
import { expressRateLimit } from "../content/middlewares/express-rate-limit.js";
import { hpp } from "../content/middlewares/hpp.js";
import { csurf } from "../content/middlewares/csurf.js";
import { expressSlowDown } from "../content/middlewares/express-slow-down.js";
import { responseTime } from "../content/middlewares/response-time.js";
import { serveFavicon } from "../content/middlewares/server-favicon.js";
import { methodOverride } from "../content/middlewares/method-override.js";
import { connectTimeout } from "../content/middlewares/connect-timeout.js";
import { expressAsyncErrors } from "../content/middlewares/express-async-error.js";
import { expressFileupload } from "../content/middlewares/express-fileupload.js";
import { expressHealthcheck } from "../content/middlewares/express-healthcheck.js";
import { expressCacheController } from "../content/middlewares/express-cache-controller.js";
import { nodemailer } from "../content/services/nodemailer.js";
import { sendgrid } from "../content/services/sendgrid.js";
import { mailchimp } from "../content/services/mailchimp.js";
import { jsonwebtoken } from "../content/services/jsonwebtoken.js";
import { bcrypt } from "../content/services/bcrypt.js";
import { passport } from "../content/services/passport.js";
import { redis } from "../content/services/redis.js";
import { mongoose } from "../content/libraries/mongoose.js";
import { sequelize } from "../content/libraries/sequelize.js";
import { typeorm } from "../content/libraries/typeorm.js";
import { socketIO } from "../content/libraries/socket.io.js";
import { swaggerUIExpress } from "../content/libraries/swagger-ui-express.js";

export const libraryFiles = {
  mongoose,
  sequelize,
  typeorm,
  "socket.io": socketIO,
  swaggerUiExpress: swaggerUIExpress,
};

export const middlewareFiles = {
  helmet: helmet,
  cors: cors,
  morgan: morgan,
  expressValidator,
  expressSession,
  cookieParser,
  compression,
  expressRateLimit,
  hpp,
  csurf,
  expressSlowDown,
  responseTime,
  serveFavicon,
  methodOverride,
  connectTimeout,
  expressAsyncErrors,
  expressFileupload,
  expressCacheController,
  expressHealthcheck,
};

export const serviceFiles = {
  nodemailer,
  sendgrid,
  mailchimp,
  jsonwebtoken,
  bcrypt,
  passport,
  redis,
};

function toCamlCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}
export function getLibraryContent(library) {
  return libraryFiles[toCamlCase(library)];
}

export function getMiddlewareContent(middleware) {
  return middlewareFiles[toCamlCase(middleware)];
}

export function getServiceContent(service) {
  return serviceFiles[toCamlCase(service)];
}
