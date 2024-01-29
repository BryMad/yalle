import * as assert from "node:assert/strict"
import { compile } from "../src/yalle.js"

describe("Compiler", () => {
  it("should compile === true", () => {
    assert.equal(compile(), "eventually this will return a compiled code")
  })
})
