# fs-css

[![Build Status](https://travis-ci.org/philcockfield/fs-css.svg?branch=master)](https://travis-ci.org/philcockfield/fs-css)

A super-fast CSS pre-processor compiler that finds, builds, caches and monitors files across the file-system.

Supported formats:
- Plain CSS (`.css`)
- Stylus (`.styl`)


## TODO
- [ ] File-system monitoring (invalidate cache / chokidar)
- [ ] Compress in production - https://www.npmjs.com/package/clean-css


## Usage
```js
  import css from "fs-css";

  css.compile("./site", {
    watch: true,      // Default true on "development", false on "production"
  })
  .then((result) => { ... })
  .catch((err) => { ... });
```




## Run
    npm install
    npm start


## Test
    # Run tests.
    npm test

    # Watch and re-run tests.
    npm run tdd
