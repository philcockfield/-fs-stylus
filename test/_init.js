import cache from "../src/cache";
import fsCache from "../src/fs-cache";

before(() => fsCache.clearSync());
after(() => fsCache.clearSync());

beforeEach(() => cache.clear());
