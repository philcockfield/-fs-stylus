"use strict";
import { expect } from "chai";
import fs from "fs-extra";
import fsPath from "path";
import css from "../src";
const SAMPLES_PATH = "./test/samples"


describe("paths", function() {
  describe("paths param", function() {
    it("throws if not path was given", () => {
      expect(() => css.compile()).to.throw();
    });

    it("converts single path to an array", () => {
      const path = `${ SAMPLES_PATH }/css`;
      const compiler = css.compile(path);
      expect(compiler.paths.length).to.equal(1);
      expect(compiler.paths[0]).to.equal(fsPath.resolve(path));
    });

    it("throws if a path does not exist", () => {
      expect(() => css.compile("./foo")).to.throw();
    });

    it("does not have the same path more than once", () => {
      const compiler = css.compile([`${ SAMPLES_PATH }/css`, null, undefined, `${ SAMPLES_PATH }/css`]);
      expect(compiler.paths.length).to.equal(1);
    });

    it("flattens paths", () => {
      const path = `${ SAMPLES_PATH }/css`;
      const compiler = css.compile([[[path]]]);
      expect(compiler.paths.length).to.equal(1);
      expect(compiler.paths[0]).to.equal(fsPath.resolve(path));
    });
  });


  describe("sourceFiles", function() {
    it("has no source files", () => {
      const compiler = css.compile(`${ SAMPLES_PATH }/empty`);
      expect(compiler.paths.sourceFiles).to.eql([]);
    });

    it("has [.css] and [.styl] files (deep)", () => {
      const compiler = css.compile(`${ SAMPLES_PATH }/css`);
      const sourceFiles = compiler.paths.sourceFiles;
      expect(sourceFiles).to.include(fsPath.resolve(SAMPLES_PATH, "css/common.mixin.styl"));
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
