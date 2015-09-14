# fs-css
A CSS pre-processor compiler that finds and builds and monitors files across the file-system.


## Examples

```js
  import css from "fs-css";

  css.compile({
    preprocessor: "stylus",
    path: [""], // String or array.
    watch: true, // Default true.
    ignore: [/node_modules/, /^\..*$/]
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
