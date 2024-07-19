import assert from "node:assert/strict";
import parse from "../src/parser.js";

const syntaxChecks = [
  // TODO toal office hours... why was first test working as printed? why was print still working across the board?
  ["all numeric literal forms", "print(89.123);"],
  ["complex expressions", "print(83 * ((((-((((13 / 21)))))))) + 1 - 0);"],
  ["all unary operators", "print(-3); holler (!false);"],
  ["all binary operators", "print( (x && y) || z * 1 / 2 ** 3 + 4 < 5);"],
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
    "task calculate(int: a, float: b, string: c) ~~{ roundup 4; }",
  ],
  ["for loop with array", "for item in [1, 2, 3, 4] ~~{ print(item); }"],
// TODO add back ors & ands
  ["and logical operators", "brand x -= true && false;"],
  ["end of program inside comment", "print(0); //yay"],
  ["comments with no text are ok", "holler(1);//\nholler(0);//"],
  ["non-Latin letters in identifiers", "コンパイラ -= 100;"],
  ["return", "roundup x;"],
    ["break / whoa statement", "whoa ;"],
  ["complex array types", "function f(x: [[[int?]]?]) ~~{}"],
  [
    "conditional 1",
    "iffin horsehoes < horses * 4 ~~{roundup moreHorseShoes();}",
  ],
  [
    "conditional 2",
    "iffin horsehoes < horses * 4 ~~{roundup moreHorseShoes();} otherwise ~~{roundup 30;}",
  ],
  ["while/till", "till month < 9 ~~{holler(30);}"],
    ["array type for param", "task f(x: [[[boolean]]]) ~~{}"],
    ["array type returned", "task fart(): [[int]] ~~{}"],

  
  
  
 
/* Office hours:
  why do these not work? why doesn't wrastle count as an id or wrastle() as a call?
  ["function declaration", "void myFunc() ~~{ wrastle; }"],
  ["function declaration", "void myFunc() ~~{ wrastle(); }"],
  ["nested if", "iffin x > 5 ~~{ iffin y < 10 ~~{ wrastle; } }"],
  ["constructor declaration", "constructor(int a, int b) ~~{ wrastle; }"],*/

  ["function declaration", "task myFunc() ~~{ wrastle(3); }"],
  ["function call with arguments", 'myFunc(42, "hello");'],
  ["function call with arguments", "myFunc(42, 34);"],
  [
    "string literal with escaped characters",
    'holler("This is a \\"test\\".");',
    ],
  // not going to work w/ Carlos arrays
  // ["array declaration and initialization", "brand [int] nums -= [1, 2, 3, 4];"],

  ["nested if", "iffin x > 5 ~~{ iffin y < 10 ~~{ holler(3); } }"],
  ["for loop", "for i in [1,2,3] ~~{ holler(i); }"],
  [
    "chained logical and arithmetic operations",
    "brand result -= (x > 5 && y < 10) || (a + b == c - d);",
    ],
    ["struct declaration", "ranch RanchInfo -x-x-x-x- \n acres: int \n cattle: int \n-x-x-x-x-"],
    ["struct initialized", "brand KingRanch -= RanchoInfo(825000, 35000);"], 
  ["function works", "task calculateHorseshoes(int: horses, int: horseshoes) ~~{iffin horsehoes < horses * 4 ~~{roundup false;}}"],
  // ! TODO struct test
//   [
//     "try-catch-finally block",
//     "try ~~{ riskyOperation(); } catch (Error e) ~~{ handle(e); } finally ~~{ cleanup(); }",
//   ],
  ["optional types", "task f(c: int?): float ~~{}"],
];

const syntaxErrors = [
  ["non-letter in an identifier", "ab😭c = 2", /Line 1, col 3/],
  ["malformed number", "x-= 2.", /Line 1, col 7/],
  ["missing semicolon", "x -= 3 y -= 1", /Line 1, col 8/],
  ["a missing right operand", "print(5 -", /Line 1, col 10/],
  ["a non-operator", "holler(7 * ((2 _ 3)", /Line 1, col 16/],
  ["an expression starting with a )", "x -= );", /Line 1, col 6/],
  ["a statement starting with expression", "x * 5;", /Line 1, col 3/],
  ["an illegal statement on line 2", "holler(5);\nx * 5;", /Line 2, col 3/],
  ["a statement starting with a )", "holler(5);\n) * 5", /Line 2, col 1/],
  ["an expression starting with a *", "x -= * 71;", /Line 1, col 6/],
  ["bad break statement", "whoa 5;", /Line 1, col 6/],
  ["too short lasso", "~{x};", /Line 1, col 1/],
  ["double if", "iffin iffin x == 2", /Line 1, col 7/],
    ["missing brand handle", "brand x = 5;", /Line 1, col 9/],
  //OLD GRAMMAR array handling
//   [
//     "array declaration and initialization missing bracket",
//     "brand [int nums = [1, 2, 3, 4];",
//     /Line 1, col 12/,
//   ],
//   [
//     'chained logical and arithmetic operations missing "or" pipe',
//     "brand bool result -= (x > 5 && y < 10) | (a + b == c - d);",
//     /Line 1, col 40/,
//   ],
  ["missing semicolon", "iffin x > 5 ~~{ holler(x)}", /Line 1, col 26/],
  ["misplaced semicolon", "iffin x > 5; ~~{ holler(x);", /Line 1, col 12/],
  ["missing block closure", "iffin x > 5 ~~{ holler(x);", /Line 1, col 27/],
    ["wrong symbol in expression", "x -= 5 $ 3;", /Line 1, col 8/],
    
  /*More Questions for office hours: is this an ohm or a javascript issue?
  ["unterminated string, 'holler("This is a test);', /Line 1, col 20/],
  what's going on here?
  ["wrong break", "if x > 5 ~~{ break; }", /Line 1, col 13/],*/
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
