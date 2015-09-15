import _ from "lodash";
import fs from "fs-extra";
import fsPath from "path";
import * as fsLocal from "./fs";


/**
 * Retrieves the set of plain CSS files.
 * @param {array} paths: An array of paths to the source [.styl] files.
 * @return {promise}.
 */
export default (paths) => {
  if (!_.isArray(paths)) { paths = [paths]; }
  paths = _(paths).filter(path => _.endsWith(path, ".css")).value();
  return new Promise((resolve, reject) => {
    fsLocal.processFiles(paths, (args, done) => {
        done(null, { path: args.path, css: args.file });
    })
    .then((result) => resolve(result))
    .catch((err) => reject(err));
  });
};
