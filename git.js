import chalkPipe from 'chalk-pipe';
import { exec } from 'child_process';
import os from 'os';

const toProperCase = (str) => {
  return str.toLowerCase().split(' ')
          .map(word => word.charAt(0)
          .toUpperCase() + word.slice(1)).join(' ');
}

const runGitCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
}

const handleCommand = async (cmd) => {
  try {
    const output = await runGitCommand(cmd);
    console.log(chalkPipe('dim.italic')(output));
  } catch (err) {
    console.error(chalkPipe('red.dim.italic')(`Error: ${err}`));
  }
};

const silent = `> /dev/null 2>&1`;
const os_type = os.platform();
const gitCommands = [`git add .`, `git commit -m "Git commit using ${toProperCase(os_type)}."`, `git push -u origin main`];

gitCommands.forEach(cmd => {
  handleCommand(`${cmd}`);
});