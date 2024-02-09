import * as ohm from "ohm-js";
import * as fs from "node:fs";

// Load the grammar from a .ohm file
const grammar = ohm.grammar(fs.readFileSync("ohm_exercises.ohm"));

// Define a function to check if a string matches a particular rule in the grammar
export function matches(ruleName, input) {
  const matchResult = grammar.match(input, ruleName);
  return matchResult.succeeded();
}
