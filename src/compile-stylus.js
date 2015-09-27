import R from "ramda";
import stylus from "stylus";
import nib from "nib";
import fs from "fs-extra";
import fsPath from "path";
import * as util from "./util";


const compileToCss = (stylusText, path, mixins, callback) => {
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
const compile = (paths) => {
  if (!R.is(Array, paths)) { paths = [paths]; }
  paths = R.filter(path => path.endsWith(".styl"), paths);

  // Seperate the mixin files.
  const mixinPaths = R.filter(util.isMixin, paths);
  const stylusPaths = R.filter(path => !util.isMixin(path), paths);

  // Compile Stylus => CSS.
  return new Promise((resolve, reject) => {
      util.processFiles(stylusPaths, (args, done) => {
          const { file, path } = args;
          compileToCss(file, path, mixinPaths, (err, css) => done(err, { path, css }));
      })
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
};



export default { compile };
