import _ from "lodash";
import stylus from "stylus";
import nib from "nib";
import fs from "fs-extra";
import fsPath from "path";
// import chokidar from "chokidar";


const readFileSync = (path) => {
  if (fs.existsSync(path)) {
    return fs.readFileSync(path).toString()
  }
};



const toCss = (stylusText, path, callback) => {
    /*
      TODO
      See: https://learnboost.github.io/stylus/docs/js.html
      either use 'import' or 'include' for mixins.

    */
    stylus(stylusText)
        .set("filename", path)
        .use(nib())
        .import("nib")
        // .import(fsPath.join(__dirname, "../mixins"))
        .render(callback);
  };




/**
 * Converts the given stylus paths to CSS.
 * @param {array} paths: An array of paths to the source [.styl] files.
 * @return {promise}.
 */
export default (paths) => {
  if (!_.isArray(paths)) { paths = [paths]; }
  return new Promise((resolve, reject) => {
      const result = [];
      let completed = 0;
      let isDone = false;

      const done = (err, css, path) => {
          if (isDone) { return; }
          if (err) {
            // Failed.
            reject(err); isDone = true;
          } else {
            // Success.
            result.push({ path, css });
            completed += 1;
            if (completed === paths.length) {
              // All files have been transpiled.
              resolve(result);
              isDone = true;
            }
          }
        };

      paths.forEach(path => {
        toCss(readFileSync(path), path, (err, css) => { done(err, css, path); });
      });
  });
};
