"use strict";
import { expect } from "chai";
import css from "../src";
import fs from "fs-extra";
import fsPath from "path";


describe("configuration", function() {
  const SAMPLES_PATH = "./test/samples"
  const deleteFolders = () => {
    // fs.removeSync(fsPath.resolve(SAMPLES_PATH));
  };
  afterEach(() => deleteFolders());

  describe("paths param", function() {
    it("throws if not path was given", () => {
      expect(() => css.compile()).to.throw();
    });

    it("converts single path to an array", () => {
      const compiler = css.compile(SAMPLES_PATH);
      expect(compiler.paths.length).to.equal(1);
      expect(compiler.paths[0]).to.equal(fsPath.resolve(SAMPLES_PATH));
    });

    it("throws if a path does not exist", () => {
      expect(() => css.compile("./foo")).to.throw();
    });
  });

  describe("options", function() {
    describe("watch", function() {
      let nodeEnv;
      beforeEach(() => { nodeEnv = process.env.NODE_ENV; });
      afterEach(() => { process.env.NODE_ENV = nodeEnv });

      it("watches in 'development' environment by default", () => {
        process.env.NODE_ENV = "development";
        expect(css.compile(SAMPLES_PATH).options.watch).to.equal(true);
      });

      it("does not watch in 'production' environment by default", () => {
        process.env.NODE_ENV = "production";
        expect(css.compile(SAMPLES_PATH).options.watch).to.equal(false);
      });

      it("uses specified watch value", () => {
        expect(css.compile(SAMPLES_PATH, { watch: true }).options.watch).to.equal(true);
        expect(css.compile(SAMPLES_PATH, { watch: false }).options.watch).to.equal(false);
      });
    });
  });


  describe("source file paths", function() {
    it("has no source files", () => {
      const compiler = css.compile(`${ SAMPLES_PATH }/empty`);
      expect(compiler.paths.sourceFiles).to.eql([]);
    });

    it("has [.css] and [.styl] files", () => {
      const compiler = css.compile(SAMPLES_PATH);
      const sourceFiles = compiler.paths.sourceFiles;
      expect(sourceFiles).to.include(fsPath.resolve(SAMPLES_PATH, "css/common.mixins.styl"));
      expect(sourceFiles).to.include(fsPath.resolve(SAMPLES_PATH, "css/mixins.styl"));
      expect(sourceFiles).to.include(fsPath.resolve(SAMPLES_PATH, "css/normalize.css"));
      expect(sourceFiles).to.include(fsPath.resolve(SAMPLES_PATH, "root.styl"));
    });

    it("does not have non CSS files", () => {
      const compiler = css.compile(SAMPLES_PATH);
      const sourceFiles = compiler.paths.sourceFiles;
      expect(sourceFiles).not.to.include(fsPath.resolve(SAMPLES_PATH, ".foo"));
      expect(sourceFiles).not.to.include(fsPath.resolve(SAMPLES_PATH, "foo.js"));
    });
  });
});
