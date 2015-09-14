"use strict";
import { expect } from "chai";
import css from "../src";
import fs from "fs-extra";
import fsPath from "path";


describe("configuration", function() {
  const deleteFolders = () => { fs.removeSync(fsPath.resolve("./foo")); };
  afterEach(() => deleteFolders());

  describe("paths", function() {
    it("throws if not path was given", () => {
      expect(() => css.compile()).to.throw();
    });

    it("converts single path to an array", () => {
      const compiler = css.compile("./foo");
      expect(compiler.paths).to.eql([fsPath.resolve("./foo")]);
    });
  });

  describe("options", function() {
    describe("watch", function() {
      let nodeEnv;
      beforeEach(() => { nodeEnv = process.env.NODE_ENV; });
      afterEach(() => { process.env.NODE_ENV = nodeEnv });

      it("watches in 'development' environment by default", () => {
        process.env.NODE_ENV = "development";
        expect(css.compile("./foo").options.watch).to.equal(true);
      });

      it("does not watch in 'production' environment by default", () => {
        process.env.NODE_ENV = "production";
        expect(css.compile("./foo").options.watch).to.equal(false);
      });

      it("uses specified watch value", () => {
        expect(css.compile("./foo", { watch: true }).options.watch).to.equal(true);
        expect(css.compile("./foo", { watch: false }).options.watch).to.equal(false);
      });
    });
  });
});
