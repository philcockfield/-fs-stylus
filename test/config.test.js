"use strict";
import { expect } from "chai";
import fs from "fs-extra";
import fsPath from "path";
import css from "../src";
const SAMPLES_PATH = "./test/samples"


describe("configuration", function() {
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
});
