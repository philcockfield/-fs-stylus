import fsCache from "../src/fs-cache";

before(() => fsCache.clear());
after(() => fsCache.clear());
