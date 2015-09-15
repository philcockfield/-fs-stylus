import fs from "fs-extra";
import fsPath from "path";
import * as fsLocal from "./fs";

const BUILD_PATH = fsPath.join(__dirname, "../.build");
const CACHE = {};

export const buildPath = (path) => {
  const dirName = fsPath.dirname(path);
  const fileName = fsPath.basename(path);
  return fsPath.join(__dirname, `../.build/${ fsLocal.hash(dirName) }-${ fileName }`);
};


export default {
  /**
   * Gets the item from the cache.
   */
  get(path) {
    path = buildPath(path);
    const result = CACHE[path]
        ? CACHE[path]
        : fsLocal.readFileSync(path);
    CACHE[path] = result;
    return result;
  },


  /**
   * Saves CSS to file and stores it in the memory cahe.
   * @param path: The path of the source file.
   * @param css:  The compiled CSS.
   */
  set(path, css) {
    path = buildPath(path);
    fs.outputFileSync(path, css);
    CACHE[path] = css;
  },


  /**
   * Removes the specified item from the cache.
   * @param path: The path of the source file.
   */
  remove(path) {
    path = buildPath(path);
    delete CACHE[path];
    fs.removeSync(path);
  },


  /**
   * Deletes all files stored in the [.build] cache.
   */
  clear() {
    fsLocal.childPaths(BUILD_PATH).forEach(path => {
        fs.removeSync(path);
        delete CACHE[path];
    });
  }
};
