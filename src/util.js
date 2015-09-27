import R from "ramda";
import fs from "fs-extra";
import fsPath from "path";
import crypto from "crypto";


export const isMixin = (path) => {
    const name = fsPath.basename(path, ".styl");
    if (name === "mixin") { return true; }
    if (name.endsWith(".mixin")) { return true; }
    return false;
  };




export const isDirectory = (path) => fs.lstatSync(path).isDirectory();


export const childPaths = (dir, result = []) => {
  if (!isDirectory(dir)) {
    result.push(dir)
    return result;
  }
  fs.readdirSync(dir).forEach(file => {
        const path = fsPath.join(dir, file);
        if (isDirectory(path)) {
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



export const hash = (...paths) => {
  paths = R.pipe(R.flatten, R.reject(R.isNil))(paths);
  const hash = crypto.createHash("md5")
  paths.forEach(path => hash.update(path));
  return hash.digest("hex");
};




export const processFiles = (paths, handler) => {
  if (!R.is(Array, paths)) { paths = [paths]; }

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
