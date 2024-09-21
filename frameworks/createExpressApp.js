export const createExpressApp = (framework, extension, answers, settings) => {
  if (answers.framework === "Express") {
    if ((settings.nodeType = "ESM")) {
      return createModuleExpress(answers);
    } else {
      return createCommonExpress(answers);
    }
  }
};

function createModuleExpress(answers) {
  if (answers.framework === "Express") {
    let content = `import express from 'express';`;
  }
}

function createCommonExpress(answers) {
  if (answers.framework === "Express") {
    let content = `const express = require("express");`;
  }
}
