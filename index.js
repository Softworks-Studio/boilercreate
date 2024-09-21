import { program } from "commander";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import gradient from "gradient-string";
import boxen from "boxen";
import createFolders from "./utils/createFolders.js";
import { exec } from "child_process";
import util from "util";

export const emoji = {
  rocket: "🚀",
  sparkles: "✨",
  hammer: "🔨",
  check: "✅",
  error: "❌",
  sand_clock: "⏳",
};

program
  .version("1.0.0")
  .description(
    `${emoji.rocket} Boilercreate - Backend Boilerplate Generator by Softworks Studio (softworks.studio)`
  );

program
  .command("create")
  .description("Create a new backend project")
  .action(async () => {
    console.log(
      gradient.pastel.multiline(
        boxen("Welcome to Boilercreate by Softworks Studio!", {
          padding: 1,
          margin: 1,
          borderStyle: "round",
          borderColor: "cyan",
        })
      )
    );

    try {
      const { projectName } = await inquirer.prompt([
        {
          type: "input",
          name: "projectName",
          message: "Enter project name:",
          default: "my-backend-project",
          validate: async (input) => {
            if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
              return "Project name can only contain letters, numbers, hyphens, and underscores.";
            }
            if (await fs.pathExists(input)) {
              return "A directory with this name already exists. Please choose a different name.";
            }
            return true;
          },
        },
      ]);

      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "nodeType",
          message: "Choose a Node.js type:",
          choices: ["ESM"],
          default: "ESM",
        },
        {
          type: "list",
          name: "framework",
          message: "Choose a backend framework (more coming soon!):",
          choices: ["Express"],
        },
        {
          type: "checkbox",
          name: "libraries",
          message: "Select libraries (use space to select multiple):",
          choices: [
            { name: "Mongoose (MongoDB ODM)", value: "mongoose" },
            { name: "Sequelize (SQL ORM)", value: "sequelize" },
            { name: "TypeORM (TypeScript ORM)", value: "typeorm" },
            { name: "Socket.io (Real-time communication)", value: "socket.io" },
            {
              name: "Swagger UI Express (API documentation)",
              value: "swagger-ui-express",
            },
          ],
        },
        {
          type: "checkbox",
          name: "middleware",
          message: "Select middleware (use space to select multiple):",
          choices: [
            { name: "CORS (Cross-Origin Resource Sharing)", value: "cors" },
            { name: "Helmet (Security headers)", value: "helmet" },
            { name: "Morgan (HTTP request logger)", value: "morgan" },
            {
              name: "Express Validator (Input validation)",
              value: "express-validator",
            },
            {
              name: "Express Session (Session management)",
              value: "express-session",
            },
            { name: "Cookie Parser (Parse cookies)", value: "cookie-parser" },
            {
              name: "Compression (Response compression)",
              value: "compression",
            },
            {
              name: "Express Rate Limit (Rate limiting)",
              value: "express-rate-limit",
            },
            { name: "HPP (HTTP Parameter Pollution protection)", value: "hpp" },
            { name: "Csurf (CSRF protection)", value: "csurf" },
            {
              name: "Express Slow Down (Rate limiting with slow down)",
              value: "express-slow-down",
            },
            {
              name: "Response Time (X-Response-Time header)",
              value: "response-time",
            },
            { name: "Serve Favicon (Serve favicon)", value: "serve-favicon" },
            {
              name: "Method Override (HTTP method override)",
              value: "method-override",
            },
            {
              name: "Connect Timeout (Request timeout handling)",
              value: "connect-timeout",
            },
            {
              name: "Express Async Errors (Async error handling)",
              value: "express-async-errors",
            },
            {
              name: "Express File Upload (File upload handling)",
              value: "express-fileupload",
            },
            {
              name: "Express Caching (Response caching)",
              value: "express-cache-controller",
            },
            {
              name: "Express Health Check (Health check endpoint)",
              value: "express-healthcheck",
            },
          ],
        },
        {
          type: "checkbox",
          name: "services",
          message: "Select services (use space to select multiple):",
          choices: [
            { name: "Nodemailer (Email sending)", value: "nodemailer" },
            { name: "SendGrid (Email service)", value: "sendgrid" },
            { name: "Mailchimp (Email marketing)", value: "mailchimp" },
            { name: "JSON Web Token (Authentication)", value: "jsonwebtoken" },
            { name: "bcrypt (Password hashing)", value: "bcrypt" },
            { name: "Passport (Authentication middleware)", value: "passport" },
            { name: "Redis (In-memory data store)", value: "redis" },
          ],
        },
        {
          type: "confirm",
          name: "useTypeScript",
          message: "Would you like to use TypeScript?",
          default: false,
        },
        {
          type: "confirm",
          name: "useDocker",
          message: "Would you like to include Docker configuration?",
          default: false,
        },
        {
          type: "confirm",
          name: "useCICD",
          message:
            "Would you like to include CI/CD configuration (GitHub Actions)?",
          default: false,
        },
        {
          type: "list",
          name: "packageManager",
          message: "Choose a package manager:",
          choices: ["npm", "yarn", "pnpm"],
          default: "npm",
        },
        {
          type: "confirm",
          name: "useEslint",
          message: "Would you like to include ESLint for code linting?",
          default: true,
        },
        {
          type: "confirm",
          name: "usePrettier",
          message: "Would you like to include Prettier for code formatting?",
          default: true,
        },
        {
          type: "confirm",
          name: "useGit",
          message: "Would you like to initialize a Git repository?",
          default: true,
        },
      ]);

      answers.projectName = projectName;

      const spinner = ora(
        emoji.sand_clock + " Creating your project..."
      ).start();

      let commands = [];

      if (answers.useGit) {
        commands.push("git init");
      }

      let settings = {
        projectName: answers.projectName,
        useTypeScript: answers.useTypeScript,
        extensions: answers.useTypeScript ? "ts" : "js",
        nodeType: answers.nodeType || "commonjs",
      };

      // Create project folder
      await createFolders(answers, commands, settings);

      spinner.succeed(
        chalk.green(`${emoji.check} Project created successfully!`)
      );

      for (const command of commands) {
        console.log(chalk.cyan(`Running: ${command}`));
        try {
          const { stdout, stderr } = await execPromise(command);
          if (stdout) console.log(stdout);
          if (stderr) console.error(stderr);
        } catch (error) {
          console.error(chalk.red(`Error executing command: ${error.message}`));
        }
      }
    } catch (error) {
      console.error(
        boxen(chalk.red(`Error: ${error.message}`), {
          padding: 1,
          margin: 1,
          borderStyle: "round",
          borderColor: "red",
        })
      );
      process.exit(1);
    }
  });

const execPromise = util.promisify(exec);

program.parse(process.argv);
