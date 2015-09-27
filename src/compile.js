import _ from "lodash";
import R from "ramda";
import fs from "fs-extra";
import fsPath from "path";
import stylusCompiler from "./compile-stylus";
import loadCss from "./load-css";
import CacheFs from "cache-fs";



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
                 .reduce((result, file) => result += `\n\n\n${ file }`)
                 .value();
};


const saveToDisk = (fileCache, files) => {
    const toPayload = R.map(item => {
      return {
        key: item.path,
        value: { path: item.path, css: item.css }
      }
    });
    return fileCache.save(toPayload(files));
};




export default (fileCache, paths) => {
  let files, compiledFiles;

  return new Promise((resolve, reject) => {
      // Read in any existing items from cache.
      //  - store the cached CSS on the return object.
      //  - remove that existing item from the list to compile.
      fileCache.load()
      .then(cached => {
          const cachedFiles = R.filter(item => item.value)(cached.files)
          const cachedPaths = R.map(item => item.value.path)(cachedFiles);
          const isCached = (path) => R.contains(path)(cachedPaths);
          const cachedFile = (path) => R.find(item => item.value.path === path)(cachedFiles);
          const uncachedPaths = R.reject(isCached, paths);

          // Create the return array.
          //  - populate with any CSS that already exists in the cache.
          files = paths.map(path => {
              const fromCache = cachedFile(path);
              const css = fromCache ? fromCache.value.css : undefined;
              return { path, css };
          });


          // Compile stylus.
          stylusCompiler.compile(uncachedPaths)
              .then(result => compiledFiles = result)
              .catch(err => reject(err))

          // Merge the compiled files into the result set.
          .then(() => files = merge(compiledFiles, files))

          // Cache CSS to disk.
          .then(() => saveToDisk(fileCache, compiledFiles))

          // Add raw CSS files (.css)
          .then(() => {
            return loadCss(paths)
                   .then(result => files = merge(result, files))

          // Concatenate into final result.
          .then(() => {
              try {
                resolve({ files, css: concatenate(files) });
              } catch (e) { reject(e) }
          });

      })
      .catch(err => reject(err));
    });
  });
};
