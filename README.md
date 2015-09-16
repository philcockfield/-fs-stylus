# fs-css

[![Build Status](https://travis-ci.org/philcockfield/fs-css.svg?branch=master)](https://travis-ci.org/philcockfield/fs-css)

A super-fast CSS compiler that finds, builds, caches and monitors files across the file-system.

Supported formats:
- Plain CSS (`.css`)
- [Stylus](https://learnboost.github.io/stylus/) (`.styl`)



## Usage
Pass a path, or array of paths, of the folders containing your css:

```js
import css from "fs-css";

css.compile(["./site", "./mixins"], { minify: true })
.then(result => {
    // Do something with the resulting CSS, eg.
    req.send(result.css);
})
.catch(err => throw(err));
```


## Options
```js
{
  watch: false,   // Flag indicating if file-system watching is enabled.
  minify: false,  // Flag indicating if the css should be minified.
  cache: true     // Flag indicating if caching should be employed.
}

css.compile("./path", { /* options */ });
```


## Stylus
The [nib](http://tj.github.io/nib/) CSS3 extensions are automatically imported and are available in any of your `.styl` files.

Create your own mixins, anywhere, by naming your file `<name>.mixin.styl`.  Just like the nib library, these mixins will be automatically available to all your `.styl` files.  No need to **@import** them.


## Test
    # Run tests.
    npm test

    # Watch and re-run tests.
    npm run tdd
