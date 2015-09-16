import _ from "lodash";
import * as fsLocal from "./fs";
const CACHE = {};


const getKey = (paths, options) => {
  options = _.chain(options)
      .values()
      .map(value => value.toString())
      .compact()
      .value();
  return fsLocal.hash(paths, options);
};



/**
 * Top level cache of compiled CSS.
 */
export default {
  get(paths, options = {}) { return CACHE[getKey(paths, options)]; },
  set(paths, options, css) { CACHE[getKey(paths, options)] = css; },
  remove(paths, options) { delete CACHE[getKey(paths, options)]; }
};
