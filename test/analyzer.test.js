import assert from "node:assert/strict"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import { program, variableDeclaration, variable, binary, floatType } from "../src/core.js"

// Programs that are semantically correct
const semanticChecks = [
  ["variable declarations", 'brand x -= 1; tag y -= "false";'],
  ["complex array types", "task f\\_x_ [[[int?]]?]_/ ~~{}"],
  ["increment and decrement", "tag x -= 10; x--; x++;"],
  ["initialize with empty array", "tag a -= [int]();"],
  ["type declaration", "ranch S -x-x-x-x- f: (int)->boolean? g: string -x-x-x-x-"],
  ["assign arrays", "tag a -= [int]();tag b-=[1];a-=b;b-=a;"],
  ["assign to array element", "brand a -= [1,2,3]; a[1]-=100;"],
  ["initialize with empty optional", "tag a -= no int;"],
  ["short return", "task f\\__/ ~~{ roundup; }"],
  ["long return", "task f\\__/: boolean ~~{ roundup true; }"],
  ["assign optionals", "tag a -= no int;tag b-= someodd 1;a-=b;b-=a;"],
  ["return in nested if", "task f\\__/ ~~{iffin true ~~{roundup;}}"],
  ["break in nested if", "till false ~~{iffin true ~~{whoa;}}"],
  ["long if", "iffin true ~~{holler\\_1_/;} otherwise ~~{holler\\_3_/;}"],
  ["elsif", "iffin true ~~{holler\\_1_/;} otherwise iffin true ~~{holler\\_0_/;} otherwise ~~{holler\\_3_/;}"],
  ["for over collection", "for i in [2,3,5] ~~{holler\\_1_/;}"],
  ["for in range", "for i in 1..<10 ~~{holler\\_0_/;}"],
  ["repeat", "repeat 3 ~~{tag a -= 1; holler\\_a_/;}"],
  ["conditionals with ints", "holler\\_true ? 8 : 5_/;"],
  ["conditionals with floats", "holler\\_1<2 ? 8.0 : -5.22_/;"],
  ["conditionals with strings", 'holler\\_1<2 ? "x" : "y"_/;'],
  ["??", "holler\\_someodd 5 ?? 0_/;"],
  ["nested ??", "holler\\_someodd 5 ?? 8 ?? 0_/;"],
  ["||", "holler\\_true||1<2||false||!true_/;"],
  ["&&", "holler\\_true&&1<2&&false&&!true_/;"],
  ["bit ops", "holler\\_(1&2)|(9^3)_/;"],
  ["relations", 'holler\\_1<=2 && "x">"y" && 3.5<1.2_/;'],
  ["ok to == arrays", "holler\\_[1]==[5,8]_/;"],
  ["ok to != arrays", "holler\\_[1]!=[5,8]_/;"],
  ["shifts", "holler\\_1<<3<<5<<8>>2>>0_/;"],
  ["arithmetic", "tag x-=1;holler\\_2*3+5**-3/2-5%8_/;"],
  ["array length", "holler\\_#[1,2,3]_/;"],
  ["optional types", "tag x -= no int; x -= someodd 100;"],
  ["random with array literals, ints", "holler\\_random [1,2,3]_/;"],
  ["random with array literals, strings", 'holler\\_random ["a", "b"]_/;'],
  ["random on array variables", "tag a-=[true, false];holler\\_random a_/;"],
  ["variables", "tag x-=[[[[1]]]]; holler\\_x[0][0][0][0]+2_/;"],
  ["pseudo recursive struct/ranch", "ranch S -x-x-x-x- z: S?-x-x-x-x- tag x -= S\\_no S_/;"],
  ["nested struct/ranch", "ranch T -x-x-x-x- y:int -x-x-x-x- ranch S -x-x-x-x- z: T -x-x-x-x- tag x-=S\\_T\\_1_/_/; holler\\_x.z.y_/;"],
  ["member exp", "ranch S -x-x-x-x- x: int -x-x-x-x- tag y -= S\\_1_/;holler\\_y.x_/;"],
  ["optional member exp", "ranch S -x-x-x-x- x: int -x-x-x-x- tag y -= someodd S\\_1_/;holler\\_y?.x_/;"],
  ["subscript exp", "tag a-=[1,2];holler\\_a[0]_/;"],
  ["array of struct/ranch", "ranch S-x-x-x-x- -x-x-x-x- tag x-=[S\\__/, S\\__/];"],
  ["struct/ranch of arrays and opts", "ranch S -x-x-x-x- x: [int] y: string?? -x-x-x-x- "],
  ["assigned tasks", "task f\\__/ ~~{}\ntag g -= f;g -= f;"],
  ["call of assigned tasks", "task f\\_x_int_/ ~~{}\ntag g-=f;g\\_1_/;"],
  ["type equivalence of nested arrays", "task f\\_x_ [[int]]_/ ~~{} holler\\_f\\_[[1],[2]]_/_/;"],
  [
    "call of assigned task in expression",
    `task f\\_x_ int, y_ boolean_/: int ~~{}
    tag g -= f;
    holler\\_g\\_1, true_/_/;
    f -= g; // Type check here`,
  ],
  [
    "pass a task to a task",
    `task f\\_x_ int, y_ (boolean)->void_/: int ~~{ roundup 1; }
     task g\\_z_ boolean_/ ~~{}
     f\\_2, g_/;`,
  ],
  [
    "task return types",
    `task square\\_x_ int_/: int ~~{ roundup x * x; }
     task compose\\__/: (int)->int ~~{ roundup square; }`,
  ],
  ["task assign", "task f\\__/ ~~{} tag g -= f; tag h -= [g, f]; holler\\_h[0]\\__/_/;"],
  ["ranch parameters", "ranch S -x-x-x-x- -x-x-x-x- task f\\_x_ S_/ ~~{}"],
  ["array parameters", "task f\\_x_ [int?]_/ ~~{}"],
  ["optional parameters", "task f\\_x_ [int], y_ string?_/ ~~{}"],
  ["empty optional types", "holler\\_no [int]_/; holler\\_no string_/;"],
  ["types in task type", "task f\\_g_ (int?, float)->string_/ ~~{}"],
  ["voids in fn type", "task f\\_g_ (void)->void_/ ~~{}"],
  ["outer variable", "tag x-=1; till(false) ~~{holler\\_x_/;}"],
  ["built-in constants", "holler\\_25.0 * π_/;"],
  ["built-in sin", "holler\\_sin\\_π_/_/;"],
  ["built-in cos", "holler\\_cos\\_93.999_/_/;"],
  ["built-in hypot", "holler\\_hypot\\_-4.0, 3.00001_/_/;"],
]

// Programs that are syntactically correct but have semantic errors
const semanticErrors = [
  ["non-distinct fields", "ranch S -x-x-x-x- x: boolean x: int -x-x-x-x-", /Fields must be distinct/],
  ["non-int increment", "tag x-=false;x++;", /an integer/],
  ["non-int decrement", 'tag x-=someodd[""];x++;', /an integer/],
  ["undeclared id", "holler\\_x_/;", /Identifier x not declared/],
  ["redeclared id", "tag x -= 1;tag x -= 1;", /Identifier x already declared/],
  ["recursive ranch", "ranch S -x-x-x-x- x: int y: S -x-x-x-x-", /must not be self-containing/],
  ["assign to const", "brand x -= 1;x -= 2;", /Cannot assign to constant/],
  ["assign bad type", "tag x-=1;x-=true;", /Cannot assign a boolean to a int/],
  ["assign bad array type", "tag x-=1;x-=[true];", /Cannot assign a \[boolean\] to a int/],
  ["assign bad optional type", "tag x-=1;x-=someodd 2;", /Cannot assign a int\? to a int/],
  ["break outside loop", "whoa;", /Break can only appear in a loop/],
  [
    "break inside task",
    "till true ~~{task f\\__/ ~~{whoa;}}",
    /Break can only appear in a loop/,
  ],
  ["return outside task", "roundup;", /Return can only appear in a task/],
  [
    "return value from void task",
    "task f\\__/ ~~{roundup 1;}",
    /Cannot return a value/,
  ],
  ["return nothing from non-void", "task f\\__/: int ~~{roundup;}", /should be returned/],
  ["return type mismatch", "task f\\__/: int ~~{roundup false;}", /boolean to a int/],
  ["non-boolean short iffin test", "iffin 1 ~~{}", /Expected a boolean/],
  ["non-boolean iffin test", "iffin 1 ~~{} otherwise ~~{}", /Expected a boolean/],
  ["non-boolean while test", "till 1 ~~{}", /Expected a boolean/],
  ["non-integer repeat", 'repeat "1" ~~{}', /Expected an integer/],
  ["non-integer low range", "for i in true...2 ~~{}", /Expected an integer/],
  ["non-integer high range", "for i in 1..<no int ~~{}", /Expected an integer/],
  ["non-array in for", "for i in 100 ~~{}", /Expected an array/],
  ["non-boolean conditional test", "holler\\_1?2:3_/;", /Expected a boolean/],
  ["diff types in conditional arms", "holler\\_true?1:true_/;", /not have the same type/],
  ["unwrap non-optional", "holler\\_1??2_/;", /Expected an optional/],
  ["bad types for ||", "holler\\_false||1_/;", /Expected a boolean/],
  ["bad types for &&", "holler\\_false&&1_/;", /Expected a boolean/],
  ["bad types for ==", "holler\\_false==1_/;", /Operands do not have the same type/],
  ["bad types for !=", "holler\\_false==1_/;", /Operands do not have the same type/],
  ["bad types for +", "holler\\_false+1_/;", /Expected a number or string/],
  ["bad types for -", "holler\\_false-1_/;", /Expected a number/],
  ["bad types for *", "holler\\_false*1_/;", /Expected a number/],
  ["bad types for /", "holler\\_false/1_/;", /Expected a number/],
  ["bad types for **", "holler\\_false**1_/;", /Expected a number/],
  ["bad types for <", "holler\\_false<1_/;", /Expected a number or string/],
  ["bad types for <=", "holler\\_false<=1_/;", /Expected a number or string/],
  ["bad types for >", "holler\\_false>1_/;", /Expected a number or string/],
  ["bad types for >=", "holler\\_false>=1_/;", /Expected a number or string/],
  ["bad types for ==", "holler\\_2==2.0_/;", /not have the same type/],
  ["bad types for !=", "holler\\_false!=1_/;", /not have the same type/],
  ["bad types for negation", "holler\\_-true_/;", /Expected a number/],
  ["bad types for length", "holler\\_#false_/;", /Expected an array/],
  ["bad types for not", 'holler\\_!"hello"_/;', /Expected a boolean/],
  ["bad types for random", "holler\\_random 3_/;", /Expected an array/],
  ["non-integer index", "tag a-=[1];holler\\_a[false]_/;", /Expected an integer/],
  ["no such field", "ranch S -x-x-x-x- -x-x-x-x- tag x-=S\\__/; holler\\_x.y_/;", /No such field/],
  ["diff type array elements", "holler\\_[3,3.0]_/;", /Not all elements have the same type/],
  ["shadowing", "tag x -= 1;\ntill true ~~{tag x -= 1;}", /Identifier x already declared/],
  ["call of uncallable", "tag x -= 1;\nholler\\_x\\__/_/;", /Call of non-task or non-ranch/],
  [
    "Too many args",
    "task f\\_x_ int_/ ~~{}\nf\\_1,2_/;",
    /1 argument\(s\) required but 2 passed/,
  ],
  [
    "Too few args",
    "task f\\_x_ int_/ ~~{}\nf\\__/;",
    /1 argument\(s\) required but 0 passed/,
  ],
  [
    "Parameter type mismatch",
    "task f\\_x_ int_/ ~~{}\nf\\_false_/;",
    /Cannot assign a boolean to a int/,
  ],
  [
    "task type mismatch",
    `task f\\_x_ int, y_ (boolean)->void_/: int ~~{ roundup 1; }
     task g\\_z_ boolean_/: int ~~{ roundup 5; }
     f\\_2, g_/;`,
    /Cannot assign a \(boolean\)->int to a \(boolean\)->void/,
  ],
  ["bad param type in fn assign", "task f\\_x_ int_/ ~~{} task g\\y_ float/ ~~{} f -= g;"],
  [
    "bad return type in fn assign",
    'task f\\_x_ int_/: int ~~{roundup 1;} task g\\_y_ int_/: string ~~{roundup "uh-oh";} f -= g;',
    /Cannot assign a \(int\)->string to a \(int\)->int/,
  ],
  ["bad call to sin\\__/", "holler\\_sin\\_true_/_/;", /Cannot assign a boolean to a float/],

  ["bad call to sin\\__/", "holler\\_sin\\_4_/_/;", /Cannot assign a int to a float/],
  ["bad call to sin\\__/", 'holler\\_sin\\_"blah"_/_/; ', /Cannot assign a string to a float/],
  ["bad return type for int function", 'task addNine\\_num_ int_/: int ~~{ roundup "blah";}', /Cannot assign a string to a int/],
  ["Non-type in param", "tag x-=1;task f\\_y_x_/~~{}", /Type expected/],
  ["Non-type in return type", "tag x-=1;task f\\__/:x~~{roundup 1;}", /Type expected/],
  ["Non-type in field type", "tag x-=1;ranch S -x-x-x-x- y:x -x-x-x-x-", /Type expected/],
  ["contravariant parameter types assignment",
    `task f\\_x_ int_/: int ~~{ roundup x; }
      task g\\_x_ boolean_/: int ~~{ roundup 1; }
        f -= g;`,
    /Cannot assign a \(boolean\)->int to a \(int\)->int/,
  ],
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
