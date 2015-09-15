"use strict";
import { expect } from "chai";
import fs from "fs-extra";
import fsPath from "path";
import css from "../src";
import fsCache from "../src/fs-cache";
import { buildPath } from "../src/fs-cache";

const SAMPLES_PATH = "./test/samples"


describe("Build folder (cache)", function() {
  describe("copying to [.build] path", function() {
    it("copies", (done) => {
      fsCache.clear();
      css.compile(`${ SAMPLES_PATH }/single`)
      .then((result) => {
          result.files.map(file => {
              const cachedFile = fs.readFileSync(buildPath(file.path)).toString();
              expect(cachedFile).to.include("body {");
              expect(cachedFile).to.include("background: #f00");
          });
          done();
      });
    });
  });
});
