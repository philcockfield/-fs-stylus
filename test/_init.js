import fs from "fs-extra";
import fsPath from "path";
import cache from "../src/cache";

const deleteBuildFolder = () => fs.removeSync(fsPath.resolve("./.build"));

before(() => deleteBuildFolder());
after(() => deleteBuildFolder());

beforeEach(() => cache.clear());
