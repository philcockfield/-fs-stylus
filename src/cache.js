import _ from "lodash";
import * as fsLocal from "./fs";
let cache = {};


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
  key: getKey,
  keys() { return _.keys(cache); },
  value(key, value) {
    if (value === null) { delete cache[key]; }
    if (value !== undefined) { cache[key] = value; }
    return cache[key]
  },
  remove(key) { this.value(key, null); },
  clear() { cache = {}; }
};
