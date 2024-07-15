import chalkPipe from 'chalk-pipe';
import dotenv from 'dotenv';
import express from 'express';
import { fileURLToPath } from 'url';
import fs from 'fs';
import open from 'open';
import path from 'path';
import readline from 'readline';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const server_root = 'public';
const server_folder = path.resolve(__dirname, server_root);
const server_path = path.resolve(server_folder, 'index.html');

const root_src = 'node_modules';
const module = 'bootstrap';
const src_files = ['min.css', 'bundle.min.js'];

const int = (val) => {
  return parseInt(val.replace(/[^\d]/g, ''));
}

const toProperCase = (str) => {
  return str.toLowerCase().split(' ')
          .map(word => word.charAt(0)
          .toUpperCase() + word.slice(1)).join(' ');
}

const readFirstTwoLines = async (files) => {
  let latestVersion, currentVersion;

  for (const file of files) {
    const fileStream = fs.createReadStream(file);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await(const line of rl) {
      const versionMatch = line.match(new RegExp(`${toProperCase(module)}\\s+v(\\d+\\.\\d+\\.\\d+)`)) || false;
      if (versionMatch && versionMatch[1]) {
        if (!latestVersion) {
          latestVersion = versionMatch[1];
        } else {
          currentVersion = versionMatch[1];
        }
        break;
      }
    }
    rl.close();
    if (currentVersion && latestVersion) {
      const result = int(currentVersion) < int(latestVersion) || false;
      const emoji = result ? '👎🏻' : '👍🏻';
      const color = result ? 'red' : 'green';
      console.log(chalkPipe(`dim.${color}.bold`)(` - '${toProperCase(path.basename(file))} v${currentVersion}' ${emoji}`));
      return result;
    }
  }
}

const startServer = async () => {
  const port = process.env.PORT || 3000;
  const app = express();
  
  app.use(express.static(server_folder));

  app.get('/', (req, res) => {
    res.sendFile(server_path);
  });

  await new Promise((resolve, reject) => {
    app.listen(port, (err) => {
      if (err) {
        reject(err);
        return;
      }
      const url = `http://localhost:${port}`;
      console.log(chalkPipe('brightWhite.bold')(' 🌐 Server running at'), chalkPipe('blue.bold.underline')(`${url}\n`));
      resolve(url);
    });
  });

  await open(`http://localhost:${port}`);
}


src_files.forEach(file => {
  const fname = `${module}.${file}`;
  const file_ext = fname.substring(fname.lastIndexOf('.') + 1);
  const src_folder = path.join(root_src, module, "dist", file_ext);
  const src_file = path.resolve(__dirname, src_folder, fname);
  const dest_folder = path.join(server_root, file_ext);
  const dest_file = path.resolve(__dirname, dest_folder, fname);

  readFirstTwoLines([src_file, dest_file])
    .then(result => {
    if (result) {
      fs.copyFile(src_file, dest_file, (err) => {
        console.log(chalkPipe('dim.italic')(`\t- Updating '${toProperCase(fname)}'.`));
        const success_log = chalkPipe('dim.green.italic')('\t- Success! 👍🏻');
        
        if (err && err.code !== 'EEXIST') throw err;
        if (!err) {
          console.log(success_log);
        } else {
          // Overwrite the destination file
          fs.copyFile(src_file, dest_file, fs.constants.COPYFILE_FICLONE_FORCE, (err) => {
            if (err) throw err;
            console.log(success_log);
          });
        }
      });
    }
  })
    .
  catch (err => {
    console.error(chalkPipe('red.bold')(`\nError reading files: ${err}`));
  })

});

startServer().catch(err => {
  console.error(chalkPipe('red.bold')(`\nError starting server: ${err}`));
});