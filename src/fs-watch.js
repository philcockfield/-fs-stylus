import R from 'ramda';
import fsPath from 'path';
import chokidar from 'chokidar';
import memoryCache from './cache';
import { isMixin } from './util';
import { EXTENSIONS } from './const';

const COMPILERS = [];
const isCss = (path) => R.any(ext => path.endsWith(ext))(EXTENSIONS);

const cachesFromPath = (path) => {
  const isMatch = (item) => R.contains(path, item.files);
  return R.pipe(
    R.filter(isMatch),
    R.map(R.prop('fileCache'))
  )(COMPILERS);
};


const onCssFileChanged = (path) => {
  cachesFromPath(path).forEach(cache => {
    if (isMixin(path)) {
      // Mixins effect multiple files,
      // clear the entire set of cached files.
      cache.clear();
    } else {
      // Delete the single file.
      cache.remove(path);
    }
  });

  // Clear the memory cache.
  memoryCache.clear();
};



let isWatching = false;
const startWatching = () => {
  if (isWatching) { return; }
  isWatching = true;
  chokidar.watch('.', { ignored: /[\/\\]\./ })
    .on('change', path => {
      if (isCss(path)) {
        onCssFileChanged(fsPath.resolve(path));
      }
    });
};



export default (fileCache, files) => {
  // Store reference to the compiler settings.
  COMPILERS.push({ fileCache, files });
  startWatching();
};
