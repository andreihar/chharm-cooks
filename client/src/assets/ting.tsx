const { Project } = require('ts-morph');
const fs = require('fs');

// Create a Project
const project = new Project({});
const sourceFile = project.addSourceFileAtPath('DefaultAuthors.tsx');

// Get the array of default authors
const defaultAuthors = sourceFile.getVariableDeclarationOrThrow('defaultAuthors');
const arrayLiteralExpression = defaultAuthors.getInitializerIfKindOrThrow('ArrayLiteralExpression');

// Extract the data
const data = arrayLiteralExpression.getElements().map(element => {
  const arguments = element.getArguments();
  return {
    username: arguments[0].getLiteralText(),
    password: arguments[1].getLiteralText(),
    picture: arguments[2].getLiteralText(),
    social: arguments[3].getLiteralText(),
  };
});

// Write the data to a JSON file
fs.writeFileSync('DefaultAuthors.json', JSON.stringify(data, null, 2));