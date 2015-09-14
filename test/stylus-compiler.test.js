"use strict";
import { expect } from "chai";
import fs from "fs-extra";
import fsPath from "path";
import compileStylus from "../src/compile-stylus";

const SAMPLES_PATH = "./test/samples"



describe("compile-stylus", function() {
  it("returns a Promise", () => {
    const paths = [fsPath.resolve(SAMPLES_PATH, "root.styl")];
    expect(compileStylus(paths).then).to.be.an.instanceof(Function);
  });


  it("converts stylus file to CSS", (done) => {
    const paths = [fsPath.resolve(SAMPLES_PATH, "root.styl")];
    compileStylus(paths)
    .then((result) => {
      expect(result.length).to.equal(1);
      expect(result[0].css).to.include("body {")
      expect(result[0].css).to.include("background: #f00")
      done();
    });
  });


  it.skip("throws descriptive error with invalid stylus content", () => {});
  it.skip("imports [*.mixin.styl] files", () => {});

});
