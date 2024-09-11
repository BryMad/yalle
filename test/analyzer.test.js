import assert from "node:assert/strict"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import { program, variableDeclaration, variable, binary, floatType } from "../src/core.js"

// Programs that are semantically correct
const semanticChecks = [
  ["variable declarations", 'brand x -= 1; tag y -= "false";'],
  ["complex array types", "task f(x: [[[int?]]?]) ~~{}"],
  ["increment and decrement", "tag x -= 10; x--; x++;"],
  ["initialize with empty array", "tag a -= [int]();"],
  ["type declaration", "ranch S -x-x-x-x- f: (int)->boolean? g: string -x-x-x-x-"],
  ["assign arrays", "tag a -= [int]();tag b-=[1];a-=b;b-=a;"],
  ["assign to array element", "brand a -= [1,2,3]; a[1]-=100;"],
  ["initialize with empty optional", "tag a -= no int;"],
  ["short return", "task f() ~~{ roundup; }"],
  ["long return", "task f(): boolean ~~{ roundup true; }"],
  ["assign optionals", "tag a -= no int;tag b-= someodd 1;a-=b;b-=a;"],
  ["return in nested if", "task f() ~~{iffin true ~~{roundup;}}"],
  ["break in nested if", "till false ~~{iffin true ~~{whoa;}}"],
  ["long if", "iffin true ~~{holler(1);} otherwise ~~{holler(3);}"],
  ["elsif", "iffin true ~~{holler(1);} otherwise iffin true ~~{holler(0);} otherwise ~~{holler(3);}"],
  ["for over collection", "for i in [2,3,5] ~~{holler(1);}"],
  ["for in range", "for i in 1..<10 ~~{holler(0);}"],
  ["repeat", "repeat 3 ~~{tag a -= 1; holler(a);}"],
  ["conditionals with ints", "holler(true ? 8 : 5);"],
  ["conditionals with floats", "holler(1<2 ? 8.0 : -5.22);"],
  ["conditionals with strings", 'holler(1<2 ? "x" : "y");'],
  ["??", "holler(someodd 5 ?? 0);"],
  ["nested ??", "holler(someodd 5 ?? 8 ?? 0);"],
  ["||", "holler(true||1<2||false||!true);"],
  ["&&", "holler(true&&1<2&&false&&!true);"],
  ["bit ops", "holler((1&2)|(9^3));"],
  ["relations", 'holler(1<=2 && "x">"y" && 3.5<1.2);'],
  ["ok to == arrays", "holler([1]==[5,8]);"],
  ["ok to != arrays", "holler([1]!=[5,8]);"],
  ["shifts", "holler(1<<3<<5<<8>>2>>0);"],
  ["arithmetic", "tag x-=1;holler(2*3+5**-3/2-5%8);"],
  ["array length", "holler(#[1,2,3]);"],
  ["optional types", "tag x -= no int; x -= someodd 100;"],
  ["random with array literals, ints", "holler(random [1,2,3]);"],
  ["random with array literals, strings", 'holler(random ["a", "b"]);'],
  ["random on array variables", "tag a-=[true, false];holler(random a);"],
  ["variables", "tag x-=[[[[1]]]]; holler(x[0][0][0][0]+2);"],
  ["pseudo recursive struct/ranch", "ranch S -x-x-x-x- z: S?-x-x-x-x- tag x -= S(no S);"],
  ["nested struct/ranch", "ranch T -x-x-x-x- y:int -x-x-x-x- ranch S -x-x-x-x- z: T -x-x-x-x- tag x-=S(T(1)); holler(x.z.y);"],
  ["member exp", "ranch S -x-x-x-x- x: int -x-x-x-x- tag y -= S(1);holler(y.x);"],
  ["optional member exp", "ranch S -x-x-x-x- x: int -x-x-x-x- tag y -= someodd S(1);holler(y?.x);"],
  ["subscript exp", "tag a-=[1,2];holler(a[0]);"],
  ["array of struct/ranch", "ranch S-x-x-x-x- -x-x-x-x- tag x-=[S(), S()];"],
  ["struct/ranch of arrays and opts", "ranch S -x-x-x-x- x: [int] y: string?? -x-x-x-x- "],
  ["assigned tasks", "task f() ~~{}\ntag g -= f;g -= f;"],
  ["call of assigned tasks", "task f(x: int) ~~{}\ntag g-=f;g(1);"],
  ["type equivalence of nested arrays", "task f(x: [[int]]) ~~{} holler(f([[1],[2]]));"],
  [
    "call of assigned task in expression",
    `task f(x: int, y: boolean): int ~~{}
    tag g -= f;
    holler(g(1, true));
    f -= g; // Type check here`,
  ],
  [
    "pass a task to a task",
    `task f(x: int, y: (boolean)->void): int ~~{ roundup 1; }
     task g(z: boolean) ~~{}
     f(2, g);`,
  ],
  [
    "task return types",
    `task square(x: int): int ~~{ roundup x * x; }
     task compose(): (int)->int ~~{ roundup square; }`,
  ],
  ["task assign", "task f() ~~{} tag g -= f; tag h -= [g, f]; holler(h[0]());"],
  ["ranch parameters", "ranch S -x-x-x-x- -x-x-x-x- task f(x: S) ~~{}"],
  ["array parameters", "task f(x: [int?]) ~~{}"],
  ["optional parameters", "task f(x: [int], y: string?) ~~{}"],
  ["empty optional types", "holler(no [int]); holler(no string);"],
  ["types in task type", "task f(g: (int?, float)->string) ~~{}"],
  ["voids in fn type", "task f(g: (void)->void) ~~{}"],
  ["outer variable", "tag x-=1; till(false) ~~{holler(x);}"],
  ["built-in constants", "holler(25.0 * π);"],
  ["built-in sin", "holler(sin(π));"],
  ["built-in cos", "holler(cos(93.999));"],
    ["built-in hypot", "holler(hypot(-4.0, 3.00001));"],
]

// Programs that are syntactically correct but have semantic errors
const semanticErrors = [
  ["non-distinct fields", "ranch S -x-x-x-x- x: boolean x: int -x-x-x-x-", /Fields must be distinct/],
  ["non-int increment", "tag x-=false;x++;", /an integer/],
  ["non-int decrement", 'tag x-=someodd[""];x++;', /an integer/],
  ["undeclared id", "holler(x);", /Identifier x not declared/],
  ["redeclared id", "tag x -= 1;tag x -= 1;", /Identifier x already declared/],
    ["recursive ranch", "ranch S -x-x-x-x- x: int y: S -x-x-x-x-", /must not be self-containing/],
  ["assign to const", "brand x -= 1;x -= 2;", /Cannot assign to constant/],
  ["assign bad type", "tag x-=1;x-=true;", /Cannot assign a boolean to a int/],
  ["assign bad array type", "tag x-=1;x-=[true];", /Cannot assign a \[boolean\] to a int/],
  ["assign bad optional type", "tag x-=1;x-=someodd 2;", /Cannot assign a int\? to a int/],
  ["break outside loop", "whoa;", /Break can only appear in a loop/],
  [
    "break inside task",
    "till true ~~{task f() ~~{whoa;}}",
    /Break can only appear in a loop/,
    ],
  ["return outside task", "roundup;", /Return can only appear in a task/],
  [
    "return value from void task",
    "task f() ~~{roundup 1;}",
    /Cannot return a value/,
    ],
  ["return nothing from non-void", "task f(): int ~~{roundup;}", /should be returned/],
  ["return type mismatch", "task f(): int ~~{roundup false;}", /boolean to a int/],
  ["non-boolean short iffin test", "iffin 1 ~~{}", /Expected a boolean/],
  ["non-boolean iffin test", "iffin 1 ~~{} otherwise ~~{}", /Expected a boolean/],
  ["non-boolean while test", "till 1 ~~{}", /Expected a boolean/],
  ["non-integer repeat", 'repeat "1" ~~{}', /Expected an integer/],
  ["non-integer low range", "for i in true...2 ~~{}", /Expected an integer/],
  ["non-integer high range", "for i in 1..<no int ~~{}", /Expected an integer/],
  ["non-array in for", "for i in 100 ~~{}", /Expected an array/],
  ["non-boolean conditional test", "holler(1?2:3);", /Expected a boolean/],
  ["diff types in conditional arms", "holler(true?1:true);", /not have the same type/],
  ["unwrap non-optional", "holler(1??2);", /Expected an optional/],
  ["bad types for ||", "holler(false||1);", /Expected a boolean/],
  ["bad types for &&", "holler(false&&1);", /Expected a boolean/],
  ["bad types for ==", "holler(false==1);", /Operands do not have the same type/],
  ["bad types for !=", "holler(false==1);", /Operands do not have the same type/],
  ["bad types for +", "holler(false+1);", /Expected a number or string/],
  ["bad types for -", "holler(false-1);", /Expected a number/],
  ["bad types for *", "holler(false*1);", /Expected a number/],
  ["bad types for /", "holler(false/1);", /Expected a number/],
  ["bad types for **", "holler(false**1);", /Expected a number/],
  ["bad types for <", "holler(false<1);", /Expected a number or string/],
  ["bad types for <=", "holler(false<=1);", /Expected a number or string/],
  ["bad types for >", "holler(false>1);", /Expected a number or string/],
  ["bad types for >=", "holler(false>=1);", /Expected a number or string/],
  ["bad types for ==", "holler(2==2.0);", /not have the same type/],
  ["bad types for !=", "holler(false!=1);", /not have the same type/],
  ["bad types for negation", "holler(-true);", /Expected a number/],
  ["bad types for length", "holler(#false);", /Expected an array/],
  ["bad types for not", 'holler(!"hello");', /Expected a boolean/],
  ["bad types for random", "holler(random 3);", /Expected an array/],
  ["non-integer index", "tag a-=[1];holler(a[false]);", /Expected an integer/],
  ["no such field", "ranch S -x-x-x-x- -x-x-x-x- tag x-=S(); holler(x.y);", /No such field/],
  ["diff type array elements", "holler([3,3.0]);", /Not all elements have the same type/],
    ["shadowing", "tag x -= 1;\ntill true ~~{tag x -= 1;}", /Identifier x already declared/],
  // ! TODO
  ["call of uncallable", "tag x -= 1;\nholler(x());", /Call of non-task or non-ranch/],
  [
    "Too many args",
    "task f(x: int) ~~{}\nf(1,2);",
    /1 argument\(s\) required but 2 passed/,
  ],
  [
    "Too few args",
    "task f(x: int) ~~{}\nf();",
    /1 argument\(s\) required but 0 passed/,
  ],
  [
    "Parameter type mismatch",
    "task f(x: int) ~~{}\nf(false);",
    /Cannot assign a boolean to a int/,
  ],
  [
    "task type mismatch",
    `task f(x: int, y: (boolean)->void): int ~~{ roundup 1; }
     task g(z: boolean): int ~~{ roundup 5; }
     f(2, g);`,
    /Cannot assign a \(boolean\)->int to a \(boolean\)->void/,
  ],
  ["bad param type in fn assign", "task f(x: int) ~~{} task g(y: float) ~~{} f -= g;"],
  [
    "bad return type in fn assign",
    'task f(x: int): int ~~{roundup 1;} task g(y: int): string ~~{roundup "uh-oh";} f -= g;',
    /Cannot assign a \(int\)->string to a \(int\)->int/,
  ],
    ["bad call to sin()", "holler(sin(true));", /Cannot assign a boolean to a float/],
 
    ["bad call to sin()", "holler(sin(4));", /Cannot assign a int to a float/],
    ["bad call to sin()", 'holler(sin("blah")); ', /Cannot assign a string to a float/],
    ["bad return type for int function", 'task addNine(num: int): int ~~{ roundup "blah";}', /Cannot assign a string to a int/],
//    ["bad return type for void function", 'tag ', /Cannot assign a void to a string/],

//   ["bad call to sin()", "holler(sin(true));", /Cannot assign a boolean to a float/],
//   ["bad call to sin()", "holler(sin(true));", /Cannot assign a boolean to a float/],
  
  ["Non-type in param", "tag x-=1;task f(y:x)~~{}", /Type expected/],
  ["Non-type in return type", "tag x-=1;task f():x~~{roundup 1;}", /Type expected/],
  ["Non-type in field type", "tag x-=1;ranch S -x-x-x-x- y:x -x-x-x-x-", /Type expected/],
]

describe("The analyzer", () => {
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(parse(source)))
    })
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => analyze(parse(source)), errorMessagePattern)
    })
  }
  it("produces the expected representation for a trivial program", () => {
    assert.deepEqual(
      analyze(parse("tag x -= π + 2.2;")),
      program([
        variableDeclaration(
          variable("x", false, floatType),
          binary("+", variable("π", true, floatType), 2.2, floatType)
        ),
      ])
    )
  })
})
