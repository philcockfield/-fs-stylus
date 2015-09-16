import _ from "lodash";
import fs from "fs-extra";
import fsPath from "path";
import * as fsLocal from "./fs";

const CACHE = {};
const BUILD_PATH = fsPath.join(__dirname, "../.build");
fs.ensureDirSync(BUILD_PATH);


const remove = (buildPath) => {
  delete CACHE[buildPath];
  fs.removeSync(buildPath);
};


/**
 * Handles caching of CSS to the file-system.
 *    This allows for start-up times, which is especially
 *    useful when developing.
 */
export default {
  /**
   * Gets the item from the cache.
   * @param {array|string} ns: A unique string/array to group the files by.
   */
  get(ns, path) {
    const buildPath = fsLocal.buildPath(ns, path);
    const result = CACHE[buildPath]
        ? CACHE[buildPath]
        : fsLocal.readFileSync(buildPath);
    CACHE[buildPath] = result;
    return result;
  },


  /**
   * Saves CSS to file and stores it in the memory cahe.
   * @param {array|string} ns: A unique string/array to group the files by.
   * @param path: The path of the source file.
   * @param css:  The compiled CSS.
   */
  set(ns, path, css) {
    const buildPath = fsLocal.buildPath(ns, path);
    fs.outputFileSync(buildPath, css);
    CACHE[buildPath] = css;
  },


  /**
   * Removes the specified item from the cache.
   * @param {array|string} ns: A unique string/array to group the files by.
   * @param path: The path of the source file.
   */
  remove(ns, path) { remove(fsLocal.buildPath(ns, path)); },


  /**
   * Deletes all files stored in the [.build] cache.
   */
  clear() { fsLocal.childPaths(BUILD_PATH).forEach(path => remove(path)); },


  /**
   * Loads all given files into the cache.
   * @param {array|string} ns: A unique string/array to group the files by.
   * @param {array} paths: The source file paths to load.
   * @return {array} of the paths that were loaded from the cache.
   */
  load(ns, ...paths) {
    return _.chain(paths)
            .flatten()
            .map(path => this.get(ns, path) ? path : null)
            .compact()
            .value();
  },


  /**
   * Saves the given items to the cache.
   * @param {array|string} ns: A unique string/array to group the files by.
   * @param {array} items: The { path, css } items to save.
   * @return {array} of items.
   */
  save(ns, ...items) {
    return _.chain(items)
            .flatten()
            .map(item => {
                this.set(ns, item.path, item.css); // Save to cache/file.
                return item;
            })
            .value();
  }
};
