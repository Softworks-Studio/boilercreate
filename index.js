import { program } from "commander";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import createFolders from "./utils/createFolders.js";

const emoji = {
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
      chalk.bold(
        `\n${emoji.sparkles} Welcome to Boilercreate by Softworks Studio! ${emoji.sparkles}\n`
      )
    );

    try {
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "projectName",
          message: "Enter project name",
          default: "my-backend-project",
        },
        {
          type: "list",
          name: "nodeType",
          message: "Choose a Node.js type:",
          choices: ["commonjs", "ESM"],
          default: "commonjs",
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
            { name: "Prisma (Modern database toolkit)", value: "prisma" },
            { name: "TypeORM (TypeScript ORM)", value: "typeorm" },
            { name: "Socket.io (Real-time communication)", value: "socket.io" },
            { name: "Bull (Redis-based queue)", value: "bull" },
            { name: "GraphQL (Query language for APIs)", value: "graphql" },
            { name: "Apollo Server (GraphQL server)", value: "apollo-server" },
            {
              name: "Swagger UI Express (API documentation)",
              value: "swagger-ui-express",
            },
            { name: "Jest (Testing framework)", value: "jest" },
            { name: "Supertest (HTTP assertions)", value: "supertest" },
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
            { name: "Stripe (Payment processing)", value: "stripe" },
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
      ]);

      // Rest of your code...

      let commands = ["npm install"];
      let settings = {
        projectName: answers.projectName,
        useTypeScript: answers.useTypeScript,
        extensions: answers.useTypeScript ? "ts" : "js",
        nodeType: answers.nodeType || "commonjs",
      };

      // Create project folder
      await createFolders(answers, commands, settings);

      // Generate main server file
      //   const serverContent = generateServerFile(
      //     answers.framework,
      //     answers.libraries,
      //     answers.databases
      //   );
      //   await fs.writeFile("src/server.js", serverContent);

      //   // Generate package.json
      //   const packageJson = generatePackageJson(
      //     answers.framework,
      //     answers.libraries,
      //     answers.databases
      //   );
      //   await fs.writeFile("package.json", JSON.stringify(packageJson, null, 2));

      //   // Generate .gitignore
      //   await fs.writeFile(".gitignore", "node_modules\n.env\n");

      //   // Generate .env
      //   await fs.writeFile(".env", "# Environment variables\nPORT=3000\n");

      //   spinner.succeed(
      //     chalk.green(`${emoji.check} Project created successfully!`)
      //   );

      //   console.log(chalk.cyan(`\n${emoji.rocket} To get started:`));
      //   console.log(chalk.white(`  cd ${projectName}`));
      //   console.log(chalk.white("  npm install"));
      //   console.log(chalk.white("  npm start"));
    } catch (error) {
      console.error(chalk.red(`\n${emoji.error} Error: ${error.message}`));
      process.exit(1);
    }
  });

function generateServerFile(framework, libraries, databases) {
  let content = `// ${framework} server\n\n`;

  // Add imports based on selected options
  if (framework === "Express") {
    content += "import express from 'express';\n";
    content += "import dotenv from 'dotenv';\n\n";
    content += "dotenv.config();\n\n";
    content += "const app = express();\n\n";
  } else if (framework === "NestJS") {
    content += "import { NestFactory } from '@nestjs/core';\n";
    content += "import { AppModule } from './app.module.js';\n\n";
  } // Add other frameworks as needed

  libraries.forEach((lib) => {
    content += `import ${lib} from '${lib}';\n`;
  });

  content += "\n";

  // Add basic server setup
  if (framework === "Express") {
    content += "const PORT = process.env.PORT || 3000;\n\n";
    content += "app.use(express.json());\n\n";
    content += "app.get('/', (req, res) => {\n";
    content += "  res.send('Hello from Boilercreate!');\n";
    content += "});\n\n";
    content += "app.listen(PORT, () => {\n";
    content +=
      "  console.log(`${emoji.rocket} Server running on port ${PORT}`);\n";
    content += "});\n";
  } else if (framework === "NestJS") {
    content += "async function bootstrap() {\n";
    content += "  const app = await NestFactory.create(AppModule);\n";
    content += "  await app.listen(3000);\n";
    content +=
      "  console.log(`${emoji.rocket} Server running on port 3000`);\n";
    content += "}\n";
    content += "bootstrap();\n";
  }

  return content;
}

function generatePackageJson(framework, libraries, databases) {
  const packageJson = {
    name: "my-backend-project",
    version: "1.0.0",
    description:
      "Backend project generated with Boilercreate by Softworks Studio",
    main: "src/server.js",
    type: "module",
    scripts: {
      start: "node src/server.js",
      dev: "nodemon src/server.js",
    },
    dependencies: {
      dotenv: "^16.0.0",
    },
    devDependencies: {
      nodemon: "^2.0.15",
    },
  };

  // Add framework dependency
  if (framework === "Express") {
    packageJson.dependencies.express = "^4.17.1";
  } else if (framework === "NestJS") {
    packageJson.dependencies["@nestjs/core"] = "^8.0.0";
    packageJson.dependencies["@nestjs/common"] = "^8.0.0";
    packageJson.dependencies["@nestjs/platform-express"] = "^8.0.0";
  }

  // Add selected libraries
  libraries.forEach((lib) => {
    packageJson.dependencies[lib] = "*"; // Use appropriate version
  });

  // Add database dependencies
  databases.forEach((db) => {
    if (db === "MongoDB") {
      packageJson.dependencies.mongoose = "^6.0.0";
    } else if (db === "PostgreSQL") {
      packageJson.dependencies.pg = "^8.7.0";
    } else if (db === "MySQL") {
      packageJson.dependencies.mysql2 = "^2.3.0";
    }
  });

  return packageJson;
}

program.parse(process.argv);
