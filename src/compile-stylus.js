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
      See: https://learnboost.github.io/stylus/docs/js.html
      either use 'import' or 'include' for mixins.

    */

    stylus(stylusText)
        .set("filename", path)
        .use(nib())
        .import("nib")
        // .import(fsPath.join(__dirname, "../mixins"))
        .render((err, css) => {
            if (err) { throw err; }
            callback(css);
          });
  };




/**
 * Converts the given stylus paths to CSS.
 * @param {array} paths: An array of paths to the source [.styl] files.
 * @return {promise}.
 */
export default (paths) => {
  return new Promise((resolve, reject) => {
      const result = [];
      let completed = 0;

      const done = (path, css) => {
          result.push({ path, css });
          completed += 1;
          if (completed === paths.length) { resolve(result); }
        };

      paths.forEach(path => {
        toCss(readFileSync(path), path, (css) => { done(path, css); });
      });
  });
};
