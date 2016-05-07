import R from 'ramda';
import * as util from './util';
import cacheManager from 'cache-manager';

const memoryCache = cacheManager.caching({
  store: 'memory',
  max: 100,
  ttl: (60 * 60 * 2), // Time to live: seconds => 2-hours.
});


const getKey = (paths, options) => {
  const asStrings = R.pipe(
                        R.values,
                        R.map(R.toString),
                        R.reject(R.isNil)
                      );
  return util.hash(paths, asStrings(options));
};



/**
 * Top level cache of compiled CSS.
 */
export default {
  key: getKey,
  keys: () => memoryCache.keys(),
  value(key, value) {
    if (value === null) { memoryCache.del(key); }
    if (value !== undefined) { memoryCache.set(key, value); }
    return memoryCache.get(key);
  },
  remove(key) { this.value(key, null); },
  clear() { memoryCache.reset(); },
};
