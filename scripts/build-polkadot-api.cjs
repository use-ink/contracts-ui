const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define paths
const repoUrl = 'https://github.com/use-ink/polkadot-js-api.git';
const cloneDir = path.resolve(__dirname, '../.polkadot-js-api'); // Clone to a local folder in project
const packageBuildDir = path.resolve(cloneDir, 'packages/api-contract/build');

// Function to run shell commands
function runCommand(command, cwd) {
  try {
    execSync(command, { cwd, stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1);
  }
}

// Check if the repo is already cloned
if (!fs.existsSync(cloneDir)) {
  console.log(`Cloning repository from ${repoUrl}...`);
  runCommand(`git clone --branch peter/api-revive ${repoUrl} "${cloneDir}"`, __dirname);
} else {
  console.log(`Repository already cloned at ${cloneDir}. Pulling latest changes...`);
  runCommand('git pull', cloneDir);
}

// Install dependencies and build
console.log('Installing dependencies...');
runCommand('yarn install', cloneDir);

console.log('Building @polkadot/api-contract...');
runCommand('yarn build', cloneDir);

// Verify build output
if (!fs.existsSync(packageBuildDir)) {
  console.error(`Build failed: ${packageBuildDir} does not exist.`);
  process.exit(1);
}

console.log(`Build completed successfully. Built files are in ${packageBuildDir}.`);
