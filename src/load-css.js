import R from 'ramda';
import * as util from './util';


/**
 * Retrieves the set of plain CSS files.
 * @param {array} paths: An array of paths to the source [.styl] files.
 * @return {promise}.
 */
export default (paths) => {
  if (!R.is(Array, paths)) { paths = [paths]; }
  paths = R.filter(path => path.endsWith('.css'), paths);

  return new Promise((resolve, reject) => {
    util.processFiles(paths, (args, done) => {
      done(null, { path: args.path, css: args.file });
    })
    .then(result => resolve(result))
    .catch(err => reject(err));
  });
};
