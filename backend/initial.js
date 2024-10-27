const { exec } = require('child_process');

// Command to create a new React app
const command = 'npx create-react-app ./site/myapp';

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing command: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Standard Error: ${stderr}`);
    return;
  }
  console.log(`Standard Output:\n${stdout}`);
});
