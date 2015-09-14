import _ from "lodash";
import fs from "fs-extra";
import fsPath from "path";
import * as fsLocal from "./fs";

const EXTENSIONS = [".styl", ".css"];


export default {
  /**
   * Starts a compiler for the given path(s).
   * @param {string|array} paths: The file-system paths to compile.
   * @param {object} options:
   *                    - watch: Flag indicating if file-system watching is enabled.
   *                             When on the cache is invaidated when the source files are changed.
   *                             - True: default for 'development'
   *                             - Fase: default for 'production'
   */
  compile(paths, options = {}) {
    // Prepare the paths.
    if (!_.isArray(paths)) { paths = _.compact([paths]); }
    if (paths.length === 0) { throw new Error(`A file-system 'path' was not specified.`); }
    paths = paths.map(path => _.startsWith(path, ".") ? fsPath.resolve(path) : path);
    paths.forEach(path => {
      if (!fs.existsSync(path)) {
        throw new Error(`The path '${ path }' does not exist.`);
      }
    });

    // Retrieve source file paths.
    paths.sourceFiles = _.chain(paths)
      .map(path => fsLocal.childPaths(path))
      .flatten()
      .filter(path => _.contains(EXTENSIONS, fsPath.extname(path)))
      .value();

    // Prepare options parameters.
    options.watch =  options.watch === undefined
        ? (process.env.NODE_ENV !== "production")
        : options.watch;

    // Construct the return promise.
    const result = new Promise((resolve, reject) => {

    });

    // Finish up.
    result.options = options;
    result.paths = paths;
    return result;
  }
};
