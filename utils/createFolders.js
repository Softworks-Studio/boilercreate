/**
 * @module createProjectStructure
 * @description Creates the folder and file structure for a new backend project based on user selections.
 */

import fs from "fs/promises";
import path from "path";
import { emoji } from "../index.js";
import {
  getMiddlewareContent,
  getLibraryContent,
  getServiceContent,
} from "./contentProviders.js";
import { mkdir } from "fs";
import { createExpressApp } from "../frameworks/createExpressApp.js";

/**
 * @typedef {Object} ProjectAnswers
 * @property {string} projectName - The name of the project
 * @property {string} framework - The chosen backend framework
 * @property {string[]} libraries - Selected libraries
 * @property {string[]} middleware - Selected middleware
 * @property {string[]} services - Selected services
 * @property {boolean} useTypeScript - Whether to use TypeScript
 * @property {boolean} useDocker - Whether to include Docker configuration
 * @property {boolean} useCICD - Whether to include CI/CD configuration
 * @property {string} packageManager - The chosen package manager
 * @property {boolean} useEslint - Whether to include ESLint
 * @property {boolean} usePrettier - Whether to include Prettier
 */

/**
 * Creates the project structure based on user answers
 * @param {ProjectAnswers} answers - User answers from inquirer prompts
 * @param {Object} commands - Command utilities
 * @param {Object} settings - Additional settings
 * @returns {Promise<void>}
 */
const createProjectStructure = async (answers, commands = [], settings) => {
  const {
    projectName = "my-backend-project",
    framework = "Express",
    libraries = [],
    middleware = [],
    services = [],
    useTypeScript = false,
    useDocker = false,
    useCICD = false,
    packageManager = "npm",
    useEslint = true,
    usePrettier = true,
  } = answers;

  const extension = useTypeScript ? "ts" : "js";

  try {
    // Create project root and change directory
    await fs.mkdir(projectName);
    process.chdir(projectName);

    // Create folder structure
    await createFolderStructure(answers);

    // Create base files
    await createBaseFiles(answers, settings);

    // Create library files
    if (libraries.length > 0) {
      await createLibrariesFiles(libraries, extension);
    }

    // Create middleware files
    if (middleware.length > 0) {
      await createMiddlewareFiles(middleware, extension);
    }

    // Create service files
    if (services.length > 0) {
      await createServicesFiles(services, extension);
    }

    // Generate package.json
    await createPackageJson(answers, commands);

    console.log(`${emoji.rocket} Project ${projectName} created successfully!`);
  } catch (error) {
    console.error(
      `${emoji.error} Error creating project structure: ${error.message}`
    );
    process.exit(1); // Exit the process with an error code
  }
};

/**
 * Creates the folder structure for the project
 * @param {ProjectAnswers} answers - User answers from inquirer prompts
 * @returns {Promise<void>}
 */
const createFolderStructure = async (answers) => {
  const {
    libraries = [],
    middleware = [],
    services = [],
    useTypeScript = false,
    useDocker = false,
    useCICD = false,
  } = answers;

  const baseStructure = [
    "src",
    "src/config",
    "src/config/boilercreate",
    "src/controllers",
    "src/models",
    "src/routes",
    "src/utils",
    "test",
  ];

  const allFolders = [
    ...baseStructure,
    ...(libraries.length > 0 ? ["src/lib"] : []),
    ...(middleware.length > 0 ? ["src/middlewares"] : []),
    ...(services.length > 0 ? ["src/services"] : []),
  ];

  if (useTypeScript) {
    allFolders.push("src/types", "test/types");
  }

  if (middleware.includes("serve-static")) {
    allFolders.push("public");
  }

  if (useDocker) {
    allFolders.push("docker");
  }

  if (useCICD) {
    allFolders.push(".github/workflows");
  }

  for (const folder of allFolders) {
    await fs.mkdir(folder, { recursive: true });
  }
};

/**
 * Creates base files for the project
 * @param {ProjectAnswers} answers - User answers from inquirer prompts
 * @param {Object} settings - Additional settings
 * @returns {Promise<void>}
 */
const createBaseFiles = async (answers, settings) => {
  const { useTypeScript, useDocker, useCICD, useEslint, usePrettier } = answers;
  const extension = useTypeScript ? "ts" : "js";

  const baseFiles = [
    {
      path: `src/app.${extension}`,
      content: getAppContent(answers.framework, extension, answers, settings),
    },
    {
      path: `src/config/boilercreate/config.${extension}`,
      content: "// Configuration settings for boilercreate\n",
    },
    {
      path: `src/controllers/example.controller.${extension}`,
      content: "// Example Controller\n",
    },
    {
      path: `src/routes/example.route.${extension}`,
      content: "// Example of route\n",
    },
    {
      path: `test/app.test.${extension}`,
      content: "// Main app tests goes here\n",
    },
    {
      path: "README.md",
      content: `# ${answers.projectName}\n\nBackend project created with Boilercreate.\n`,
    },
    { path: ".gitignore", content: "node_modules\n.env\n" },
    {
      path: ".env.example",
      content: "# Example environment variables\nPORT=3000\n",
    },
  ];

  if (useTypeScript) {
    baseFiles.push(
      { path: "tsconfig.json", content: getTsConfigContent() },
      { path: "src/types/index.ts", content: "// Type definitions\n" }
    );
  }

  if (useDocker) {
    baseFiles.push(
      { path: "Dockerfile", content: getDockerfileContent() },
      {
        path: "docker-compose.yml",
        content: getDockerComposeContent(answers.projectName),
      }
    );
  }

  if (useCICD) {
    baseFiles.push({
      path: ".github/workflows/main.yml",
      content: getCICDContent(),
    });
  }

  if (useEslint) {
    baseFiles.push({
      path: ".eslintrc.json",
      content: getEslintContent(useTypeScript),
    });
  }

  if (usePrettier) {
    baseFiles.push({
      path: ".prettierrc",
      content: '{\n  "singleQuote": true,\n  "trailingComma": "es5"\n}\n',
    });
  }

  for (const file of baseFiles) {
    try {
      if (file.content !== undefined) {
        await fs.writeFile(file.path, file.content);
      } else {
        console.warn(`Skipping file ${file.path} due to undefined content`);
      }
    } catch (error) {
      console.error(`Error writing file ${file.path}: ${error.message}`);
      throw error;
    }
  }
};

/**
 * Creates library files
 * @param {string[]} libraries - Selected libraries
 * @param {string} extension - File extension (js or ts)
 * @returns {Promise<void>}
 */
const createLibrariesFiles = async (libraries, extension) => {
  for (const library of libraries) {
    const fileName = `${library.toLowerCase()}.${extension}`;
    const filePath = path.join("src", "lib", fileName);
    const fileContent = getLibraryContent(library);
    try {
      await fs.writeFile(filePath, fileContent);
      console.log(`${emoji.hammer} Added ${library} successfully!`);
    } catch (error) {
      console.error(
        `${emoji.error} Error creating ${filePath}: ${error.message}`
      );
    }
  }
};

/**
 * Creates middleware files
 * @param {string[]} middleware - Selected middleware
 * @param {string} extension - File extension (js or ts)
 * @returns {Promise<void>}
 */
const createMiddlewareFiles = async (middleware, extension) => {
  for (const mw of middleware) {
    const fileName = `${mw.toLowerCase()}.${extension}`;
    const filePath = path.join("src", "middlewares", fileName);
    const fileContent = getMiddlewareContent(mw);
    try {
      await fs.writeFile(filePath, fileContent);
      console.log(`${emoji.hammer} Added ${mw} successfully!`);
    } catch (error) {
      console.error(
        `${emoji.error} Error creating ${filePath}: ${error.message}`
      );
    }
  }
};

/**
 * Creates service files
 * @param {string[]} services - Selected services
 * @param {string} extension - File extension (js or ts)
 * @returns {Promise<void>}
 */
const createServicesFiles = async (services, extension) => {
  for (const service of services) {
    const fileName = `${service.toLowerCase()}.${extension}`;
    const filePath = path.join("src", "services", fileName);
    const fileContent = getServiceContent(service);
    try {
      await fs.writeFile(filePath, fileContent);
      console.log(`${emoji.hammer} Added ${service} successfully!`);
    } catch (error) {
      console.error(
        `${emoji.error} Error creating ${filePath}: ${error.message}`
      );
    }
  }
};

/**
 * Creates package.json file
 * @param {ProjectAnswers} answers - User answers from inquirer prompts
 * @returns {Promise<void>}
 */
const createPackageJson = async (answers, commands = []) => {
  const packageJson = generatePackageJson(answers, commands);
  await fs.writeFile("package.json", JSON.stringify(packageJson, null, 2));
};

/**
 * Generates the content for the main app file
 * @param {string} framework - The chosen framework
 * @param {string} extension - File extension (js or ts)
 * @param {ProjectAnswers} answers - User answers from inquirer prompts
 * @param {Object} settings - Additional settings
 * @returns {string} Content for the main app file
 */
const getAppContent = (framework, extension, answers, settings) => {
  let content = createExpressApp(framework, extension, answers, settings);
  return content;
};

/**
 * Generates the content for tsconfig.json
 * @returns {string} Content for tsconfig.json
 */
const getTsConfigContent = () => {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "es6",
        module: "commonjs",
        outDir: "./dist",
        strict: true,
        esModuleInterop: true,
      },
      include: ["src/**/*"],
      exclude: ["node_modules", "**/*.spec.ts"],
    },
    null,
    2
  );
};

/**
 * Generates the content for Dockerfile
 * @returns {string} Content for Dockerfile
 */
const getDockerfileContent = () => {
  return `FROM node:14\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]\n`;
};

/**
 * Generates the content for docker-compose.yml
 * @param {string} projectName - The name of the project
 * @returns {string} Content for docker-compose.yml
 */
const getDockerComposeContent = (projectName) => {
  return `version: '3'\nservices:\n  ${projectName}:\n    build: .\n    ports:\n      - "3000:3000"\n`;
};

/**
 * Generates the content for CI/CD configuration
 * @returns {string} Content for CI/CD configuration file
 */
const getCICDContent = () => {
  return `name: CI/CD\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - uses: actions/setup-node@v2\n        with:\n          node-version: '14'\n      - run: npm ci\n      - run: npm test\n`;
};

/**
 * Generates the content for .eslintrc.json
 * @param {boolean} useTypeScript - Whether TypeScript is being used
 * @returns {string} Content for .eslintrc.json
 */
const getEslintContent = (useTypeScript) => {
  const eslintConfig = {
    env: {
      node: true,
      es2021: true,
    },
    extends: ["eslint:recommended"],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: "module",
    },
    rules: {},
  };

  if (useTypeScript) {
    eslintConfig.parser = "@typescript-eslint/parser";
    eslintConfig.plugins = ["@typescript-eslint"];
    eslintConfig.extends.push("plugin:@typescript-eslint/recommended");
  }

  return JSON.stringify(eslintConfig, null, 2);
};

/**
 * Generates the content for package.json
 * @param {ProjectAnswers} answers - User answers from inquirer prompts
 * @returns {Object} Content for package.json
 */
const generatePackageJson = (answers, commands = []) => {
  const {
    projectName,
    framework,
    libraries,
    middleware,
    services,
    useTypeScript,
    packageManager,
  } = answers;

  const packageJson = {
    name: projectName,
    version: "1.0.0",
    description: `A ${framework} backend project created with Boilercreate`,
    main: useTypeScript ? "dist/app.js" : "src/app.js",
    scripts: {
      start: useTypeScript ? "node dist/app.js" : "node src/app.js",
      dev: useTypeScript
        ? "ts-node-dev --respawn src/app.ts"
        : "nodemon src/app.js",
      lint: answers.useEslint ? "eslint ." : undefined,
      format: answers.usePrettier ? "prettier --write ." : undefined,
    },
    keywords: [framework.toLowerCase(), "backend", "boilercreate"],
    author: "",
    license: "ISC",
    dependencies: {},
    devDependencies: {},
  };

  let dependencies = [framework.toLowerCase()];
  let devDependencies = [];

  if (useTypeScript) {
    devDependencies = devDependencies.concat([
      "typescript",
      "ts-node",
      "ts-node-dev",
      "@types/jest",
      "ts-jest",
      "@typescript-eslint/eslint-plugin",
      "@typescript-eslint/parser",
    ]);
    packageJson.scripts.build = "tsc";
    packageJson.scripts.start = "node dist/app.js";
  } else {
    devDependencies.push("nodemon");
  }

  // Add testing, linting, and formatting dependencies
  devDependencies = devDependencies.concat(["jest", "eslint", "prettier"]);

  // Add selected libraries, middleware, and services
  dependencies = dependencies.concat(libraries, middleware, services);

  // Create install commands based on package manager
  let installCmd, devFlag;
  switch (packageManager) {
    case "yarn":
      installCmd = "yarn add";
      devFlag = "--dev";
      break;
    case "pnpm":
      installCmd = "pnpm add";
      devFlag = "--save-dev";
      break;
    default: // npm
      installCmd = "npm install";
      devFlag = "--save-dev";
  }

  if (Array.isArray(commands)) {
    commands.push(`${installCmd} ${dependencies.join(" ")}`);
    commands.push(`${installCmd} ${devFlag} ${devDependencies.join(" ")}`);
  }

  if (packageManager === "yarn") {
    Object.keys(packageJson.scripts).forEach((scriptName) => {
      packageJson.scripts[scriptName] = packageJson.scripts[scriptName].replace(
        "npm run",
        "yarn"
      );
    });
  }

  return packageJson;
};

export {
  createProjectStructure,
  getAppContent,
  getTsConfigContent,
  getDockerfileContent,
  getDockerComposeContent,
  getCICDContent,
  getEslintContent,
  generatePackageJson,
};

export default createProjectStructure;
