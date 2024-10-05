#!/usr/bin/env node

import fs from "fs";
import path from "path";
import readline from "readline";
import chalk from "chalk";

const defaultIgnoreDirs = [
  ".git",
  ".next",
  "node_modules",
  "vendor",
  "logs",
  "dist",
  "__pycache__",
  ".DS_Store",
];

/**
 * Generates a directory structure as a markdown string from the given directory path.
 * @param {string} dirPath The path to the directory to generate the structure from.
 * @param {string[]} ignoreDirs A list of directories to ignore in the structure.
 * @returns {string} The generated directory structure as a markdown string.
 */
function generateDirectoryStructure(dirPath, ignoreDirs) {
  const structure = [];

  function traverse(currentPath, prefix = "") {
    const items = fs
      .readdirSync(currentPath)
      .filter((item) => !ignoreDirs.includes(item));

    const directories = [];
    const files = [];

    items.forEach((item) => {
      const itemPath = path.join(currentPath, item);
      if (fs.statSync(itemPath).isDirectory()) {
        directories.push(item);
      } else {
        files.push(item);
      }
    });

    // Output directories first
    directories.forEach((item, index) => {
      const isLast = index === directories.length - 1;
      const prefixSymbol = isLast ? "└── " : "├── ";
      const childPrefix = isLast ? "    " : "│   ";

      structure.push(prefix + prefixSymbol + item);
      traverse(path.join(currentPath, item), prefix + childPrefix);
    });

    // Then output files
    files.forEach((item) => {
      structure.push(prefix + "├── " + item);
    });
  }

  traverse(dirPath);
  return structure.join("\n");
}

/**
 * Updates a README.md file by replacing the existing directory structure
 * with the given directory structure.
 * @param {string} dirStructure The directory structure as a markdown string.
 * @param {string} readmePath The path to the README.md file to update.
 */
function updateReadmeFile(dirStructure, readmePath) {
  const readmeContent = fs.existsSync(readmePath)
    ? fs.readFileSync(readmePath, "utf8")
    : "";

  const updatedContent = readmeContent.replace(
    /(\n|^)# Directory Structure(.|\n)*?# End Directory Structure/gm,
    ""
  );

  const newReadmeContent =
    updatedContent +
    `\n# Directory Structure\n\n${dirStructure}\n\n# End Directory Structure`;

  fs.writeFileSync(readmePath, newReadmeContent, "utf8");
  console.log(chalk.green("Updated README.md with directory structure."));
}

/**
 * Asks the user about any additional directories to ignore, and confirms
 * the list of directories to ignore before continuing.
 * @returns {Promise<{ignoreDirs: string[]}>} A promise that resolves to an
 * object with a single property, `ignoreDirs`, which is an array of
 * directory names to ignore.
 */
async function getUserOptions() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = (question) =>
    new Promise((resolve) => rl.question(question, resolve));

  const customIgnoreDirs = await askQuestion(
    "Enter any additional directories to ignore, separated by commas (or press enter to skip): "
  );
  const ignoreDirs = customIgnoreDirs
    ? [
        ...defaultIgnoreDirs,
        ...customIgnoreDirs.split(",").map((dir) => dir.trim()),
      ]
    : defaultIgnoreDirs;

  const confirm = await askQuestion(
    `The following directories will be ignored: ${ignoreDirs.join(
      ", "
    )}\nContinue? (Y/N): `
  );

  rl.close();

  if (confirm.toLowerCase() !== "y") {
    console.log(chalk.red("Operation cancelled by the user."));
    process.exit(0);
  }

  return { ignoreDirs };
}

/**
 * The function takes two command-line arguments: the first is the directory
 * path to generate the structure from (defaults to the current working
 * directory), and the second is the path to the README file to update
 * (defaults to the path of the directory structure).
 *
 * The function first prompts the user to enter any additional directories
 * to ignore before generating the structure. The user is then asked to
 * confirm the list of ignored directories before the structure is generated
 * and written to the README file.
 */
async function main() {
  const args = process.argv.slice(2);
  const dirPath = args[0] || ".";
  const readmePath = path.join(dirPath, "README.md");

  const { ignoreDirs } = await getUserOptions();

  const dirStructure = generateDirectoryStructure(dirPath, ignoreDirs);
  updateReadmeFile(dirStructure, readmePath);
}

main().catch((error) => console.error(chalk.red(error)));
