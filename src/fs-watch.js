import _ from "lodash";
import fsPath from "path";
import chokidar from "chokidar";
import memoryCache from "./cache";
import fsCache from "./fs-cache";
import * as fsLocal from "./fs";


const COMPILERS = {};
const EXTENSIONS = [".styl", ".css"];
const isCss = (path) => _.chain(EXTENSIONS).any(ext => _.endsWith(path, ext)).value();


const nsFromPath = (path) => {
  const key = _.chain(COMPILERS)
               .keys()
               .find(key => _.find(COMPILERS[key].files, (p) => p === path))
               .value();
  if (key) {
    return COMPILERS[key].ns;
  }
};


const onCssFileChanged = (path) => {
  // Remove the specific file from the [.build] file-system cache.
  fsCache.remove(nsFromPath(path), path);

  // Clear the memory cache.
  memoryCache.clear();
};


let isWatching = false;
const startWatching = () => {
    if (isWatching) { return; }
    isWatching = true;
    chokidar.watch(".", { ignored: /[\/\\]\./ })
      .on("change", path => {
          if (isCss(path)) {
            onCssFileChanged(fsPath.resolve(path));
          }
      });
};



export default (ns, files) => {
  startWatching();

  // Store reference to the compiler settings.
  const key = fsLocal.hash(ns, files);
  COMPILERS[key] = { ns, files };
};
