import _ from "lodash";
import fs from "fs-extra";
import fsPath from "path";


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



// export const sourceFiles
