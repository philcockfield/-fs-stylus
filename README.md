# fs-css

[![Build Status](https://travis-ci.org/philcockfield/fs-css.svg?branch=master)](https://travis-ci.org/philcockfield/fs-css)

A super-fast caching CSS pre-processor compiler that finds, builds and monitors files across the file-system.


## Examples

```js
  import css from "fs-css";

  css.compile({
    path: "./site",   // String or array.
    watch: true,      // Default true on "development", false on "production"
  })
  .then((result) => {

  });
```




## Run
    npm install
    npm start


## Test
    # Run tests.
    npm test

    # Watch and re-run tests.
    npm run tdd
