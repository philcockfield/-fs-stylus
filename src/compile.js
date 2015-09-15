import _ from "lodash";
import fs from "fs-extra";
import fsPath from "path";
import * as fsLocal from "./fs";
import compileStylus from "./compile-stylus";
import loadCss from "./load-css";



export default (sourceFiles) => {
  return new Promise((resolve, reject) => {
      // Convert the source files into objects.
      // NB: This ensures that the file-order (deepest to shallowest) is retained.
      let files = sourceFiles.map(path => { return { path }});
      const mergeIntoResult = (items) => {
          items.forEach(item => {
              const index = _(files).findIndex(m => m.path === item.path)
              files[index].css = item.css
          });
      };

      // Compile stylus.
      compileStylus(sourceFiles)
          .then((result) => mergeIntoResult(result))
          .catch((err) => reject(err))

      // Add raw CSS.
      .then(() => {
        loadCss(sourceFiles)
            .then((result) => mergeIntoResult(result))
            .catch((err) => reject(err))

      // Compile into final result.
      .then(() => {
          try {
            const css = _.chain(files)
                         .map(item => item.css)
                         .compact()
                         .reduce((result, file) => result += file)
                         .value();
            resolve({ files, css });
          } catch (e) { reject(e) }
      })
    })
  });
};
