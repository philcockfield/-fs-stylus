import cache from "../src/cache";
import fsCache from "../src/fs-cache";

before(() => fsCache.clear());
after(() => fsCache.clear());

beforeEach(() => cache.clear());
