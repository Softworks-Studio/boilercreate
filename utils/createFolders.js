/**
 * @module createProjectStructure
 * @description Creates the folder and file structure for a new backend project based on user selections.
 */

import fs from "fs/promises";
import path from "path";

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
 * @returns {Promise<void>}
 */
export const createProjectStructure = async (answers) => {
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

  const baseStructure = [
    "src",
    "src/config",
    "src/controllers",
    "src/models",
    "src/routes",
    "src/utils",
    "src/middlewares",
    "src/services",
    "test",
  ];

  const allFolders = [
    ...baseStructure,
    ...libraries.map((lib) => `src/lib/${lib}`),
    ...middleware.map((mw) => `src/middlewares/${mw}`),
    ...services.map((service) => `src/services/${service}`),
  ];

  if (useTypeScript) {
    allFolders.push("src/types", "test/types");
  }

  if (useDocker) {
    allFolders.push("docker");
  }

  if (useCICD) {
    allFolders.push(".github/workflows");
  }

  try {
    // Create project root
    await fs.mkdir(projectName);
    process.chdir(projectName);

    // Create folders
    for (const folder of allFolders) {
      await fs.mkdir(folder, { recursive: true });
    }

    // Create base files
    const baseFiles = [
      {
        path: `src/app.${extension}`,
        content: getAppContent(framework, extension, answers, settings),
      },
      {
        path: `src/config/index.${extension}`,
        content: "// Configuration settings\n",
      },
      {
        path: `src/controllers/index.${extension}`,
        content: "// Export all controllers\n",
      },
      {
        path: `src/models/index.${extension}`,
        content: "// Export all models\n",
      },
      {
        path: `src/routes/index.${extension}`,
        content: "// Define and export routes\n",
      },
      {
        path: `src/utils/index.${extension}`,
        content: "// Utility functions\n",
      },
      {
        path: `src/middlewares/index.${extension}`,
        content: "// Export all custom middlewares\n",
      },
      {
        path: `src/services/index.${extension}`,
        content: "// Export all services\n",
      },
      { path: `test/app.test.${extension}`, content: "// Main app tests\n" },
      {
        path: "README.md",
        content: `# ${projectName}\n\nBackend project created with Boilercreate.\n`,
      },
      { path: ".gitignore", content: "node_modules\n.env\n" },
      {
        path: ".env.example",
        content: "# Example environment variables\nPORT=3000\n",
      },
    ];

    // Add TypeScript-specific files
    if (useTypeScript) {
      baseFiles.push(
        { path: "tsconfig.json", content: getTsConfigContent() },
        { path: "src/types/index.ts", content: "// Type definitions\n" }
      );
    }

    // Add Docker-specific files
    if (useDocker) {
      baseFiles.push(
        { path: "Dockerfile", content: getDockerfileContent() },
        {
          path: "docker-compose.yml",
          content: getDockerComposeContent(projectName),
        }
      );
    }

    // Add CI/CD-specific files
    if (useCICD) {
      baseFiles.push({
        path: ".github/workflows/main.yml",
        content: getCICDContent(),
      });
    }

    // Add linting and formatting files
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

    // Create all files
    for (const file of baseFiles) {
      await fs.writeFile(file.path, file.content);
    }

    // Generate package.json
    const packageJson = generatePackageJson(
      projectName,
      framework,
      libraries,
      middleware,
      services,
      useTypeScript,
      packageManager
    );
    await fs.writeFile("package.json", JSON.stringify(packageJson, null, 2));

    console.log(`Project ${projectName} created successfully!`);
  } catch (error) {
    console.error(`Error creating project structure: ${error.message}`);
  }
};

/**
 * Generates the content for the main app file
 * @param {string} framework - The chosen framework
 * @param {string} extension - File extension (js or ts)
 * @returns {string} Content for the main app file
 */
function getAppContent(framework, extension, answers, settings) {
  // Implementation depends on the framework
  return `// ${framework} app setup\n`;
}

/**
 * Generates the content for tsconfig.json
 * @returns {string} Content for tsconfig.json
 */
function getTsConfigContent() {
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
}

/**
 * Generates the content for Dockerfile
 * @returns {string} Content for Dockerfile
 */
function getDockerfileContent() {
  return `FROM node:14\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]\n`;
}

/**
 * Generates the content for docker-compose.yml
 * @param {string} projectName - The name of the project
 * @returns {string} Content for docker-compose.yml
 */
function getDockerComposeContent(projectName) {
  return `version: '3'\nservices:\n  ${projectName}:\n    build: .\n    ports:\n      - "3000:3000"\n`;
}

/**
 * Generates the content for CI/CD configuration
 * @returns {string} Content for CI/CD configuration file
 */
function getCICDContent() {
  return `name: CI/CD\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - uses: actions/setup-node@v2\n        with:\n          node-version: '14'\n      - run: npm ci\n      - run: npm test\n`;
}

/**
 * Generates the content for .eslintrc.json
 * @param {boolean} useTypeScript - Whether TypeScript is being used
 * @returns {string} Content for .eslintrc.json
 */
function getEslintContent(useTypeScript) {
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
}

/**
 * Generates the content for package.json
 * @param {string} projectName - The name of the project
 * @param {string} framework - The chosen framework
 * @param {string[]} libraries - Selected libraries
 * @param {string[]} middleware - Selected middleware
 * @param {string[]} services - Selected services
 * @param {boolean} useTypeScript - Whether TypeScript is being used
 * @param {string} packageManager - The chosen package manager
 * @returns {Object} Content for package.json
 */
function generatePackageJson(
  projectName,
  framework,
  libraries,
  middleware,
  services,
  useTypeScript,
  packageManager
) {
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
      test: "jest",
      lint: "eslint .",
      format: "prettier --write .",
    },
    keywords: [framework.toLowerCase(), "backend", "boilercreate"],
    author: "",
    license: "ISC",
    dependencies: {},
    devDependencies: {},
  };

  // Add framework-specific dependencies
  switch (framework.toLowerCase()) {
    case "express":
      packageJson.dependencies.express = "^4.17.1";
      break;
    case "koa":
      packageJson.dependencies.koa = "^2.13.1";
      packageJson.dependencies["koa-router"] = "^10.0.0";
      break;
    case "fastify":
      packageJson.dependencies.fastify = "^3.15.1";
      break;
    // Add more frameworks as needed
  }

  // Add selected libraries
  libraries.forEach((lib) => {
    switch (lib.toLowerCase()) {
      case "axios":
        packageJson.dependencies.axios = "^0.21.1";
        break;
      case "lodash":
        packageJson.dependencies.lodash = "^4.17.21";
        break;
      // Add more libraries as needed
    }
  });

  // Add selected middleware
  middleware.forEach((mw) => {
    switch (mw.toLowerCase()) {
      case "cors":
        packageJson.dependencies.cors = "^2.8.5";
        break;
      case "helmet":
        packageJson.dependencies.helmet = "^4.6.0";
        break;
      // Add more middleware as needed
    }
  });

  // Add selected services
  services.forEach((service) => {
    switch (service.toLowerCase()) {
      case "mongodb":
        packageJson.dependencies.mongoose = "^5.12.7";
        break;
      case "redis":
        packageJson.dependencies.redis = "^3.1.2";
        break;
      // Add more services as needed
    }
  });

  // Add TypeScript-specific dependencies and scripts
  if (useTypeScript) {
    packageJson.devDependencies.typescript = "^4.2.4";
    packageJson.devDependencies["ts-node"] = "^9.1.1";
    packageJson.devDependencies["ts-node-dev"] = "^1.1.6";
    packageJson.scripts.build = "tsc";
    packageJson.scripts.start = "node dist/app.js";
  } else {
    packageJson.devDependencies.nodemon = "^2.0.7";
  }

  // Add testing dependencies
  packageJson.devDependencies.jest = "^26.6.3";
  if (useTypeScript) {
    packageJson.devDependencies["@types/jest"] = "^26.0.23";
    packageJson.devDependencies["ts-jest"] = "^26.5.6";
  }

  // Add linting and formatting dependencies
  packageJson.devDependencies.eslint = "^7.25.0";
  packageJson.devDependencies.prettier = "^2.2.1";

  if (useTypeScript) {
    packageJson.devDependencies["@typescript-eslint/eslint-plugin"] = "^4.22.0";
    packageJson.devDependencies["@typescript-eslint/parser"] = "^4.22.0";
  }

  // Adjust scripts based on package manager
  if (packageManager === "yarn") {
    Object.keys(packageJson.scripts).forEach((scriptName) => {
      packageJson.scripts[scriptName] = packageJson.scripts[scriptName].replace(
        "npm run",
        "yarn"
      );
    });
  }

  return packageJson;
}

export default createProjectStructure;
