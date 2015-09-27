import _ from "lodash";
import * as util from "./util";
import cacheManager from "cache-manager";

const memoryCache = cacheManager.caching({
  store: "memory",
  max: 100,
  ttl: (60 * 60 * 2) // Time to live: seconds => 2-hours.
});


const getKey = (paths, options) => {
  options = _.chain(options)
      .values()
      .map(value => value.toString())
      .compact()
      .value();
  return util.hash(paths, options);
};



/**
 * Top level cache of compiled CSS.
 */
export default {
  key: getKey,
  keys() { return memoryCache.keys(); },
  value(key, value) {
    if (value === null) { memoryCache.del(key); }
    if (value !== undefined) { memoryCache.set(key, value); }
    return memoryCache.get(key);
  },
  remove(key) { this.value(key, null); },
  clear() { memoryCache.reset(); }
};
