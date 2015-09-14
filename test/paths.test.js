"use strict";
import { expect } from "chai";
import fs from "fs-extra";
import fsPath from "path";
import css from "../src";
const SAMPLES_PATH = "./test/samples"


describe("paths", function() {
  describe("sourceFiles", function() {
    it("has no source files", () => {
      const compiler = css.compile(`${ SAMPLES_PATH }/empty`);
      expect(compiler.paths.sourceFiles).to.eql([]);
    });

    it("has [.css] and [.styl] files (deep)", () => {
      const compiler = css.compile(`${ SAMPLES_PATH }/css`);
      const sourceFiles = compiler.paths.sourceFiles;
      expect(sourceFiles).to.include(fsPath.resolve(SAMPLES_PATH, "css/common.mixins.styl"));
      expect(sourceFiles).to.include(fsPath.resolve(SAMPLES_PATH, "css/mixin.styl"));
      expect(sourceFiles).to.include(fsPath.resolve(SAMPLES_PATH, "css/normalize.css"));
      expect(sourceFiles).to.include(fsPath.resolve(SAMPLES_PATH, "css/child/child.styl"));
    });

    it("does not have non CSS files", () => {
      const compiler = css.compile(SAMPLES_PATH);
      const sourceFiles = compiler.paths.sourceFiles;
      expect(sourceFiles).not.to.include(fsPath.resolve(SAMPLES_PATH, ".foo"));
      expect(sourceFiles).not.to.include(fsPath.resolve(SAMPLES_PATH, "foo.js"));
    });
  });
});
