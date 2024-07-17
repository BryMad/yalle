#! /usr/bin/env nodel

import * as fs from "node:fs/promises"
import stringify from "graph-stringify"
import compile from "./compiler.js"

// import parse from "./parser.js"
// import analyze from "./analyzer.js"

const help = `Yalle compiler

Syntax: yalle <filename> <outputType>

Prints to stdout according to <outputType>, which must be one of:

  parsed     a message that the program was matched ok by the grammar
  analyzed   the statically analyzed representation
  optimized  the optimized semantically analyzed representation
  js         the translation to JavaScript
`

async function compileFromFile(filename, outputType) {
  try {
    const buffer = await fs.readFile(filename)
    const compiled = compile(buffer.toString(), outputType)
      console.log(stringify(compiled, "kind") || compiled)
    //   const match = parse("brand int fart -= 8 ;")
    //   const rep = analyze(match)
    //   console.log(util.inspect(rep, { depth: 5 }))
      
  } catch (e) {
    console.error(`\u001b[31m${e}\u001b[39m`)
    process.exitCode = 1
  }
}

if (process.argv.length !== 4) {
  console.log(help)
} else {
  compileFromFile(process.argv[2], process.argv[3])
}