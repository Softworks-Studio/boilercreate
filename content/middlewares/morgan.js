export const morgan = `
import morgan from "morgan";

export function applyMorgan(app) {
  morgan.token("response-time-formatted", (req, res) => {
    const time = morgan['response-time'](req, res);
    return time < 1000 ? \`\${time}ms\` : \`\${(time / 1000).toFixed(3)}s\`;
  });

  morgan.token("date-iso", () => new Date().toISOString());

  const logFormat = [
    "\\x1b[36m:date-iso\\x1b[0m",
    "[\\x1b[33m:method\\x1b[0m]",
    ":url",
    ":status",
    "- :response-time-formatted",
    "- :remote-addr",
    "- :user-agent",
  ].join(" ");

  app.use(morgan(logFormat));
}
`;
