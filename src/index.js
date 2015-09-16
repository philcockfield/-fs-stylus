import _ from "lodash";
import fs from "fs-extra";
import fsPath from "path";
import fsWatch from "./fs-watch";
import * as fsLocal from "./fs";
import compile from "./compile";
import cache from "./cache";
import CleanCSS from "clean-css";
import { EXTENSIONS } from "./const";

const DEFAULTS = {
  watch: false,
  minify: false,
  cache: true
};

export default {
  defaults: DEFAULTS,

  /**
   * Starts a compiler for the given path(s).
   * @param {string|array} paths: The file-system paths to compile.
   * @param {object} options:
   *                    - watch:  Flag indicating if file-system watching is enabled.
   *                    - minify: Flag indicating if the css should be minified.
   *                    - cache:  Flag indicating if caching should be employed.
   */
  compile(paths, options = {}) {
    // Setup initial conditions.
    const cacheKey = cache.key(paths, options)
    options.minify = options.minify || DEFAULTS.minify;
    options.cache = _.isUndefined(options.cache) ? DEFAULTS.cache : options.cache;
    options.watch = options.watch || DEFAULTS.watch;

    // Check the cache.
    if (options.cache === true) {
      let css = cache.value(cacheKey);
      if (css) {
        // The value exists in the cache - return from here.
        return new Promise((resolve, reject) => { resolve({ css }) });
      }
    }

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

    // Retrieve all CSS source files within the given folders.
    paths.files = _.chain(paths)
        .map(path => fsLocal.childPaths(path))
        .flatten()
        .filter(path => _.contains(EXTENSIONS, fsPath.extname(path)))
        .value();

    // Create the unique namespace for the compiler.
    const ns = paths.map(item => item);

    // Prepare options parameters.
    if (options.watch === true) {
      fsWatch(ns, paths.files); // Start the file-system watcher.
    }


    // Construct the return promise.
    const promise = new Promise((resolve, reject) => {
        compile(ns, paths.files)
        .then(result => {
            if (options.minify === true) { result.css = new CleanCSS().minify(result.css).styles; }
            if (options.cache === true) { cache.value(cacheKey, result.css); }
            resolve(result);
        })
        .catch(err => reject(err));
    });
    promise.options = options;
    promise.paths = paths;

    // Finish up.
    return promise;
  }
};
