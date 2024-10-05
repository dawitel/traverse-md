#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Generates a string representation of the directory structure at the given path.
 * This string will be formatted with ASCII tree characters to visually represent
 * the directory structure.
 *
 * @param {string} dirPath - The path to the directory you want to get the structure of.
 * @param {string} [prefix=""] - Used internally to track the recursion depth and
 *   generate the correct indent and tree characters.
 * @returns {string} A string representation of the directory structure.
 */

function getDirectoryStructure(dirPath, prefix = "") {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let output = "";

  entries.forEach((entry, index) => {
    const isLastEntry = index === entries.length - 1;
    const connector = isLastEntry ? "└── " : "├── ";
    const newPrefix = prefix + (isLastEntry ? "    " : "│   ");

    const line = `${prefix}${connector}${entry.name}`;

    if (entry.isDirectory()) {
      output += `${line}/\n`; 
      output += getDirectoryStructure(
        path.join(dirPath, entry.name),
        newPrefix
      );
    } else {
      output += `${line}\n`; 
    }
  });

  return output;
}

/**
 * Writes or updates the README.md file with the directory structure.
 * If the README.md exists, it will update the structure by replacing
 * the old one with the new one. If not, it will create the README.md
 * with the structure.
 * @param {string} dirPath - The path to the directory you want to get the structure of.
 * @param {string} structure - The string representation of the directory structure.
 */
function writeOrUpdateReadme(dirPath, structure) {
  const readmePath = path.join(dirPath, "README.md");
  const startMarker = "<!-- START OF DIRECTORY STRUCTURE -->";
  const endMarker = "<!-- END OF DIRECTORY STRUCTURE -->";
  const newContent = `${startMarker}\n\`\`\`\n${structure}\n\`\`\`\n${endMarker}`;

  let readmeContent = "";

  // Read the README.md content if it exists
  if (fs.existsSync(readmePath)) {
    readmeContent = fs.readFileSync(readmePath, "utf-8");

    // Check if the structure markers already exist
    const startIdx = readmeContent.indexOf(startMarker);
    const endIdx = readmeContent.indexOf(endMarker);

    if (startIdx !== -1 && endIdx !== -1) {
      // Replace the old structure with the new one
      readmeContent =
        readmeContent.slice(0, startIdx) +
        newContent +
        readmeContent.slice(endIdx + endMarker.length);
    } else {
      // If markers are not found, append the structure at the end
      readmeContent += `\n# Project Directory Structure\n${newContent}\n`;
    }
  } else {
    // If README.md doesn't exist, create it with the structure
    readmeContent = `# Project Directory Structure\n\n${newContent}\n`;
  }

  fs.writeFileSync(readmePath, readmeContent);
  console.log("Directory structure updated in README.md!");
}

/**
 * The main function of the program.
 * Gets the directory path from the arguments, ensures it exists, and then
 * calls getDirectoryStructure and writeOrUpdateReadme with the given path.
 */
function main() {
  const targetPath = process.argv[2] || "."; // Default to current directory if no path is given

  if (!fs.existsSync(targetPath)) {
    console.error(`Error: Path "${targetPath}" does not exist.`);
    process.exit(1);
  }

  const directoryStructure = getDirectoryStructure(targetPath);
  writeOrUpdateReadme(targetPath, directoryStructure);
}

// Execute main function
main();
