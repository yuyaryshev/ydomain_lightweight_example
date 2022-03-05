import { hello } from "./hello.js";
import { expect } from "chai";

describe(`example.test.ts`, () => {
    it(`example.test.ts`, () => {
        expect(hello()).to.deep.equal("ytslib_policy package 'ydomain_lightweight_example' started successfully!");
    });
});
