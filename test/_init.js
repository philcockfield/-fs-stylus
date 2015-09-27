import fs from "fs-extra";
import fsPath from "path";
import cache from "../src/cache";
import { CACHE_PATH } from "../src";

const deleteCacheFolder = () => fs.removeSync(fsPath.resolve(CACHE_PATH));

before(() => deleteCacheFolder());
beforeEach(() => cache.clear());
after(() => deleteCacheFolder());
