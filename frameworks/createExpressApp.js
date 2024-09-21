export const createExpressApp = (framework, extension, answers, settings) => {
  if (answers.framework === "Express") {
    let content = createExpressServerFile(answers);
    return content;
  }
};

function createImportsESM(answers) {
  let content = `import express from 'express';\n`;
  return content;
}

function toCamlCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function createExpressServerFile(answers) {
  let content = createImportsESM(answers);

  content += `\nconst app = express();\n\n`;

  answers.libraries.forEach((lib) => {
    content += `import apply${toCamlCase(
      lib
    )} from './lib/${lib.toLowerCase()}.js';\n`;
  });

  content += `\n`;

  answers.libraries.forEach((lib) => {
    content += `apply${toCamlCase(lib)}(app);\n`;
  });

  content += `\nexport default app;`;

  return content;
}
