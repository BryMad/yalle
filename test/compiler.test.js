import assert from "assert/strict";
import compile from "../src/compiler.js"


describe("Equality Test", () => {
  it("should return true when comparing 1 to 1", () => {
    assert.strictEqual(1 === 1, true);
  });
});

const sampleProgram = "holler\\_0_/;"

describe("The compiler", () => {
  it("throws when the output type is missing", done => {
    assert.throws(() => compile(sampleProgram), /Unknown output type/)
    done()
  })
  it("throws when the output type is unknown", done => {
    assert.throws(() => compile(sampleProgram, "no such type"), /Unknown output type/)
    done()
  })
  it("accepts the parsed option", done => {
    const compiled = compile(sampleProgram, "parsed")
    assert(compiled.startsWith("Syntax is ok"))
    done()
  })
  it("accepts the analyzed option", done => {
    const compiled = compile(sampleProgram, "analyzed")
    assert(compiled.kind === "Program")
    done()
  })
  it("accepts the optimized option", done => {
    const compiled = compile(sampleProgram, "optimized")
    assert(compiled.kind === "Program")
    done()
  })
  it("generates js code when given the js option", done => {
    const compiled = compile(sampleProgram, "js")
    assert(compiled.startsWith("console.log(0)"))
    done()
  })
})