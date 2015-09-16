import _ from "lodash";
import fs from "fs-extra";
import fsPath from "path";
import * as fsLocal from "./fs";
import stylusCompiler from "./compile-stylus";
import loadCss from "./load-css";
import fsCache from "./fs-cache";


const merge = (sourceFiles, targetFiles) => {
    return targetFiles.map(item => {
        const index = _(sourceFiles).findIndex(m => m.path === item.path)
        if (index > -1) {
          item.css = sourceFiles[index].css;
        }
        return item;
    });
};


const concatenate = (files) => {
  return _.chain(files)
               .map(item => item.css)
               .compact()
               .reduce((result, file) => result += file)
               .value();
};




export default (ns, paths) => {
  return new Promise((resolve, reject) => {
      // Read in any existing items from cache.
      //  - store the cached CSS on the return object.
      //  - remove that existing item from the list to compile.
      const cachedPaths = fsCache.load(ns, paths);

      // Create the return array.
      //  - populate with any CSS that already exists in the cache.
      let files = paths.map(path => {
          const isCached = _.contains(cachedPaths, path);
          const css = isCached ? fsCache.get(ns, path) : null;
          return { path, css };
      });

      // Remove paths for items that have been retrieved from the cache.
      paths = _.filter(paths, path => !_.contains(cachedPaths, path));

      // Compile stylus.
      stylusCompiler.compile(paths)
          .then((result) => {
              fsCache.save(ns, result);
              files = merge(result, files);
          })
          .catch((err) => reject(err))

      // Add raw CSS.
      .then(() => {
        loadCss(paths)
            .then((result) => files = merge(result, files))
            .catch((err) => reject(err))

      // Concatenate into final result.
      .then(() => {
          try {
            const css = concatenate(files);
            resolve({ files, css });
          } catch (e) { reject(e) }
      })
    })
  });
};
