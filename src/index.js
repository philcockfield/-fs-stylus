import _ from "lodash";
import fs from "fs-extra";
import fsPath from "path";
import fsWatch from "./fs-watch";
import * as fsLocal from "./fs";
import compile from "./compile";
import compilerCache from "./compiler-cache";
import { EXTENSIONS } from "./const";


export default {
  /**
   * Starts a compiler for the given path(s).
   * @param {string|array} paths: The file-system paths to compile.
   * @param {object} options:
   *                    - watch:  Flag indicating if file-system watching is enabled.
   *                    - minify: Flag indicating if the css should be minified.
   */
  compile(paths, options = {}) {

    // TODO: Cache at the highest level.
    // compilerCache.get(paths, options)

    // Prepare the paths.
    if (!_.isArray(paths)) { paths = _.compact([paths]); }
    if (paths.length === 0) { throw new Error(`File-system 'path' was not specified.`); }
    paths = _.chain(paths)
        .flatten(true)
        .map(path => _.startsWith(path, ".") ? fsPath.resolve(path) : path)
        .compact()
        .unique()
        .value();
    paths.forEach(path => {
          if (!fs.existsSync(path)) { throw new Error(`The CSS folder path '${ path }' does not exist.`); }
          if (!fs.lstatSync(path).isDirectory()) { throw new Error(`The CSS folder path '${ path }' is not a directory.`); }
      });

    // Retrieve source files.
    paths.files = _.chain(paths)
        .map(path => fsLocal.childPaths(path))
        .flatten()
        .filter(path => _.contains(EXTENSIONS, fsPath.extname(path)))
        .value();

    // Prepare options parameters.
    options.watch = options.watch || false;
    if (options.watch === true) {
      fsWatch(paths); // Start the file-system watcher.
    }

    // Create the unique namespace for the compiler.
    const ns = paths.map(item => item);

    // Construct the return promise.
    const promise = compile(ns, paths.files);
    promise.options = options;
    promise.paths = paths;
    promise.css = null;

    // Finish up.
    return promise;
  }
};
