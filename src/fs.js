import _ from "lodash";
import fs from "fs-extra";
import fsPath from "path";
import crypto from "crypto";


export const childPaths = (dir, result = []) => {
  fs.readdirSync(dir).forEach(file => {
        const path = fsPath.join(dir, file);
        if (fs.lstatSync(path).isDirectory()) {
          childPaths(path, result); // <== RECURSION.
        } else {
          result.push(path);
        }
      });
  return result;
};



export const readFileSync = (path) => {
    if (fs.existsSync(path)) {
      return fs.readFileSync(path).toString()
    }
  };



export const hash = (paths) => {
  if (!_.isArray(paths)) { paths = [paths]; }
  const hash = crypto.createHash("md5")
  paths.forEach(path => hash.update(path));
  return hash.digest("hex");
};




export const processFiles = (paths, handler) => {
  if (!_.isArray(paths)) { paths = [paths]; }

  return new Promise((resolve, reject) => {
    const result = [];
    let completed = 0;
    let isDone = false;

    const done = (err, item) => {
        if (isDone) { return; }
        if (err) {
          // Failed.
          reject(err); isDone = true;
        } else {
          // Success.
          result.push(item);
          completed += 1;
          if (completed === paths.length) {
            // All files have been processed.
            resolve(result);
            isDone = true;
          }
        }
      };

    if (paths.length === 0) {
      resolve(result);
    } else {
      // Process each file
      paths.forEach(path => {
          const file = readFileSync(path);
          handler({ path, file }, done);
      });
    }
  });
};
