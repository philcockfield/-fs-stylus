import _ from "lodash";
import stylus from "stylus";
import nib from "nib";
import fs from "fs-extra";
import fsPath from "path";


const readFileSync = (path) => {
    if (fs.existsSync(path)) {
      return fs.readFileSync(path).toString()
    }
  };


const isMixin = (path) => {
    const name = fsPath.basename(path, ".styl");
    if (name === "mixin") { return true; }
    if (_.endsWith(name, ".mixin")) { return true; }
    return false;
  };


const toCss = (stylusText, path, mixins, callback) => {
    const compiler = stylus(stylusText)
        .set("filename", path)
        .use(nib())
        .import("nib");
    mixins.forEach(path => { compiler.import(path); });
    compiler.render(callback);
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

      // Extract mixin files.
      const mixins = _(paths).filter(isMixin).value();
      paths = _(paths).filter(path => !isMixin(path)).value();

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
        toCss(readFileSync(path), path, mixins, (err, css) => {
          done(err, css, path);
        });
      });
  });
};
