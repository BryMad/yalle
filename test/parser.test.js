import assert from "node:assert/strict";
import parse from "../src/parser.js";

const syntaxChecks = [
  ["all numeric literal forms", "holler\\_89.123_/;"],
  ["complex expressions", "holler\\_83 * ((((-((((13 / 21)))))))) + 1 - 0_/;"],
  ["all unary operators", "holler\\_-3_/; holler \\_!false_/;"],
  ["all binary operators", "holler\\_ (x && y) || z * 1 / 2 ** 3 + 4 < 5_/;"],
  [
    "all arithmetic operators",
    "brand x -= (!3) * 2 + 4 - (-7.3) * 8 ** 13 / 1;",
  ],
  [
    "all relational operators",
    "brand x -= 1<(2<=(3==(4!=(5 >= (6>7)))));",
  ],
  [
    "function with multiple parameters",
    "task calculate\\_int_ a, float_ b, string_ c_/ ~~{ roundup 4; }",
  ],
  ["for loop with array", "for item in [1, 2, 3, 4] ~~{ holler\\_item_/; }"],
  ["and logical operators", "brand x -= true && false;"],
  ["end of program inside comment", "holler\\_0_/; //yay"],
  ["comments with no text are ok", "holler\\_1_/;//\nholler\\_0_/;//"],
  ["non-Latin letters in identifiers", "コンパイラ -= 100;"],
  ["return", "roundup x;"],
  ["break / whoa statement", "whoa ;"],
  ["complex array types", "task f\\_x_ [[[int?]]?]_/ ~~{}"],
  [
    "conditional 1",
    "iffin horsehoes < horses * 4 ~~{roundup moreHorseShoes\\__/;}",
  ],
  [
    "conditional 2",
    "iffin horsehoes < horses * 4 ~~{roundup moreHorseShoes\\__/;} otherwise ~~{roundup 30;}",
  ],
  ["while/till", "till month < 9 ~~{holler\\_30_/;}"],
  ["array type for param", "task f\\_x_ [[[boolean]]]_/ ~~{}"],
  ["array type returned", "task boo\\__/: [[int]] ~~{}"],
  ["function declaration", "task messAround\\_num_int_/ ~~{ holler\\_num_/; }"],
  ["nested if", "iffin x > 5 ~~{ iffin y < 10 ~~{ whoa; } }"],
  ["function declaration", "task myFunc\\__/ ~~{ wrastle\\_3_/; }"],
  ["function call with arguments", 'myFunc\\_42, "hello"_/;'],
  ["function call with arguments", "myFunc\\_42, 34_/;"],
  [
    "string literal with escaped characters",
    'holler\\_"This is a \\"test\\"."_/;',
  ],
  ["nested if", "iffin x > 5 ~~{ iffin y < 10 ~~{ holler\\_3_/; } }"],
  ["for loop", "for i in [1,2,3] ~~{ holler\\_i_/; }"],
  [
    "chained logical and arithmetic operations",
    "brand result -= (x > 5 && y < 10) || (a + b == c - d);",
  ],
  ["struct declaration", "ranch RanchInfo -x-x-x-x- \n acres: int \n cattle: int \n-x-x-x-x-"],
  ["struct initialized", "brand KingRanch -= RanchoInfo\\_825000, 35000_/;"],
  ["function works", "task calculateHorseshoes\\_int_ horses, int_ horseshoes_/ ~~{iffin horsehoes < horses * 4 ~~{roundup false;}}"],
  ["optional types", "task f\\_c_ int?_/: float ~~{}"],
];

const syntaxErrors = [
  ["non-letter in an identifier", "ab😭c = 2", /Line 1, col 3/],
  ["malformed number", "x-= 2.", /Line 1, col 7/],
  ["missing semicolon", "x -= 3 y -= 1", /Line 1, col 8/],
  ["a missing right operand", "holler\\_5 -_/", /Line 1, col 12/],
  ["a non-operator", "holler\\_7 * ((2 _ 3)", /Line 1, col 17/],
  ["an expression starting with a )", "x -= );", /Line 1, col 6/],
  ["a statement starting with expression", "x * 5;", /Line 1, col 3/],
  ["an illegal statement on line 2", "holler\\_5_/;\nx * 5;", /Line 2, col 3/],
  ["a statement starting with a )", "holler\\_5_/;\n_/ * 5", /Line 2, col 1/],
  ["an expression starting with a *", "x -= * 71;", /Line 1, col 6/],
  ["bad break statement", "whoa 5;", /Line 1, col 6/],
  ["too short lasso", "~{x};", /Line 1, col 1/],
  ["double if", "iffin iffin x == 2", /Line 1, col 7/],
  ["missing brand handle", "brand x = 5;", /Line 1, col 9/],
  ["missing semicolon", "iffin x > 5 ~~{ holler\\_x_/}", /Line 1, col 28/],
  ["misplaced semicolon", "iffin x > 5; ~~{ holler\\_x_/;", /Line 1, col 12/],
  ["missing block closure", "iffin x > 5 ~~{ holler\\_x_/;", /Line 1, col 29/],
  ["wrong symbol in expression", "x -= 5 $ 3;", /Line 1, col 8/],
  ["unterminated string", 'holler\\_"This is a test_/;', /Line 1, col 27/],
  ["wrong break", "iffin x > 5 ~~{ break; }", /Line 1, col 22/]
];

describe("The parser", () => {
  for (const [scenario, source] of syntaxChecks) {
    it(`properly specifies ${scenario}`, () => {
      assert(parse(source).succeeded());
    });
  }
  for (const [scenario, source, errorMessagePattern] of syntaxErrors) {
    it(`does not permit ${scenario}`, () => {
      assert.throws(() => parse(source), errorMessagePattern);
    });
  }
});
