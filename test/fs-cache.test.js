"use strict";
import _ from "lodash";
import { expect } from "chai";
import fs from "fs-extra";
import fsPath from "path";
import css from "../src";
import fsCache from "../src/fs-cache";
import * as fsLocal from "../src/fs";

const SAMPLES_PATH = "./test/samples"


describe("Build folder (cache)", function() {
  beforeEach(() => fsCache.clear());

  describe("compile", function() {
    it("caches to file-system upon compiling", (done) => {
      const ns = fsPath.resolve(`${ SAMPLES_PATH }/1-file`);
      css.compile(ns)
      .then(result => {
          result.files.map(file => {
              const buildPath = fsLocal.buildPath(ns, file.path);
              const cachedFile = fs.readFileSync(fsLocal.buildPath(ns, file.path)).toString();
              expect(cachedFile).to.include("body {");
              expect(cachedFile).to.include("background: #f00");
          });
          done();
      })
      .catch(err => console.log("ERROR", err));
    });

    it("partially loads from the file system", (done) => {
      const ns = fsPath.resolve(`${ SAMPLES_PATH }/2-files`);
      const buildPath = fsLocal.buildPath(ns, fsPath.resolve(ns, "one.styl"));
      fs.outputFileSync(buildPath, "from cache!");
      css.compile(ns)
      .then((result) => {
          expect(result.css).to.include(".two {");
          expect(result.css).to.include("from cache!");
          done();
      })
      .catch(err => console.log("ERROR", err));
    });
  });

  describe("build path", function() {
    it("does not have a ns", () => {
      const path1 = fsLocal.buildPath(null, "foo/bar.styl");
      const path2 = fsLocal.buildPath(null, "foo/bar.styl");
      expect(path1).to.equal(path2);
      expect(_.endsWith(path1, "-bar.styl")).to.equal(true);
    });

    it("takes a string or an array as a namespace", () => {
      const path1 = fsLocal.buildPath("ns-1", "foo/bar.styl");
      const path2 = fsLocal.buildPath(["ns-1"], "foo/bar.styl");
      expect(path1).to.equal(path2);
    });

    it("returns different paths with a namespace and not namespace", () => {
      const path1 = fsLocal.buildPath(null, "foo/bar.styl");
      const path2 = fsLocal.buildPath("ns-1", "foo/bar.styl");
      expect(path1).not.to.equal(path2);
    });

    it("returns different paths with different namespaces", () => {
      const path1 = fsLocal.buildPath(["ns-1", "ns-2"], "foo/bar.styl");
      const path2 = fsLocal.buildPath(["ns-1", "ns-3"], "foo/bar.styl");
      expect(path1).not.to.equal(path2);
    });
  });


  describe("read/write API", function() {
    describe("set", function() {
      it("writes to the file-system", () => {
        const ns = ["path1", "path2"];
        const path = "foo/bar.styl";
        const buildPath = fsLocal.buildPath(ns, path);
        fsCache.set(ns, path, "body { color: red; }");
        expect(fs.readFileSync(buildPath).toString()).to.equal("body { color: red; }");
      });
    });

    describe("get", function() {
      it("returns nothing when item does not exist", () => {
        expect(fsCache.get("ns", "nothing.style")).to.equal(undefined);
        expect(fsCache.get("ns", "nothing.style")).to.equal(undefined);
      });

      it("reads from the file-system", () => {
        const ns = ["path1", "path2"];
        const path = "foo/bar.styl";
        const buildPath = fsLocal.buildPath(ns, path);
        fs.outputFileSync(buildPath, "from file");
        expect(fsCache.get(ns, path)).to.equal("from file");
      });
    });

    describe("remove", function() {
      it("does not fail when removing a non-existent item", () => {
        fsCache.remove("foo", "bar");
      });

      it("removes an item", () => {
        const ns = ["path1", "path2"];
        const path = "foo/bar.styl";
        const buildPath = fsLocal.buildPath(ns, path);
        fs.outputFileSync(buildPath, "from file");
        expect(fsCache.get(ns, path)).to.equal("from file");
        fsCache.remove(ns, path);
        expect(fsCache.get(ns, path)).to.equal(undefined);
        expect(fs.existsSync(buildPath)).to.equal(false);
      });
    });
  });

  describe("load", function() {
    it("has no items cached", () => {
      const ns = ["path1", "path2"];
      const result = fsCache.load(ns, ["foo.styl", "bar.styl"]);
      expect(result).to.eql([]);
    });

    it("has partial items cached", () => {
      const ns = ["path1", "path2"];
      fs.outputFileSync(fsLocal.buildPath(ns, "bar.styl"), "bar");
      const result = fsCache.load(ns, ["foo.styl", "bar.styl"]);
      expect(fsCache.get(ns, "foo.styl")).to.equal(undefined);
      expect(fsCache.get(ns, "bar.styl")).to.equal("bar");
      expect(result).to.eql(["bar.styl"]);
    });

    it("has all items cached", () => {
      const ns = ["path1", "path2"];
      fs.outputFileSync(fsLocal.buildPath(ns, "foo.styl"), "foo");
      fs.outputFileSync(fsLocal.buildPath(ns, "bar.styl"), "bar");
      const result = fsCache.load(ns, ["foo.styl", "bar.styl"]);
      expect(fsCache.get(ns, "foo.styl")).to.equal("foo");
      expect(fsCache.get(ns, "bar.styl")).to.equal("bar");
      expect(result).to.eql(["foo.styl", "bar.styl"]);
    });

  });
});
