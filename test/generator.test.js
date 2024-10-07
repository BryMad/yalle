import assert from "node:assert/strict"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import optimize from "../src/optimizer.js"
import generate from "../src/generator.js"

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim()
}

const fixtures = [
  {
    name: "small",
    source: `
      tag x -= 3 * 7;
      x++;
      x--;
      tag y -= true;
      y -= 5 ** -x / -100 > - x || false;
      holler\\_(y && y) || false || (x*2) != 5_/;
    `,
    expected: dedent`
      let x_1 = 21;
      x_1++;
      x_1--;
      let y_2 = true;
      y_2 = (((5 ** -(x_1)) / -(100)) > -(x_1));
      console.log(((y_2 && y_2) || ((x_1 * 2) !== 5)));
    `,
  },
  {
    name: "if",
    source: `
      tag x -= 0;
      iffin (x == 0) ~~{ holler\\_"1"_/; }
      iffin (x == 0) ~~{ holler\\_1_/; } otherwise ~~{ holler\\_2_/; }
      iffin (x == 0) ~~{ holler\\_1_/; } otherwise iffin (x == 2) ~~{ holler\\_3_/; }
      iffin (x == 0) ~~{ holler\\_1_/; } otherwise iffin (x == 2) ~~{ holler\\_3_/; } otherwise ~~{ holler\\_4_/; }
    `,
    expected: dedent`
      let x_1 = 0;
      if ((x_1 === 0)) {
        console.log("1");
      }
      if ((x_1 === 0)) {
        console.log(1);
      } else {
        console.log(2);
      }
      if ((x_1 === 0)) {
        console.log(1);
      } else
        if ((x_1 === 2)) {
          console.log(3);
        }
      if ((x_1 === 0)) {
        console.log(1);
      } else
        if ((x_1 === 2)) {
          console.log(3);
        } else {
          console.log(4);
        }
    `,
  },
  {
    name: "till",
    source: `
      tag x -= 0;
      till x < 5 ~~{
        tag y -= 0;
        till y < 5 ~~{
          holler\\_x * y_/;
          y -= y + 1;
          whoa;
        }
        x -= x + 1;
      }
    `,
    expected: dedent`
      let x_1 = 0;
      while ((x_1 < 5)) {
        let y_2 = 0;
        while ((y_2 < 5)) {
          console.log((x_1 * y_2));
          y_2 = (y_2 + 1);
          break;
        }
        x_1 = (x_1 + 1);
      }
    `,
  },
  {
    name: "tasks",
    source: `
      tag z -= 0.5;
      task f\\_x_ float, y_ boolean_/ ~~{
        holler\\_sin\\_x_/ > π_/;
        roundup;
      }
      task g\\__/: boolean ~~{
        roundup false;
      }
      f\\_z, g\\__/_/;
    `,
    expected: dedent`
      let z_1 = 0.5;
      function f_2(x_3, y_4) {
        console.log((Math.sin(x_3) > Math.PI));
        return;
      }
      function g_5() {
        return false;
      }
      f_2(z_1, g_5());
    `,
  },
  {
    name: "arrays",
    source: `
      tag a -= [true, false, true];
      tag b -= [10, #a - 20, 30];
      brand c -= [[int]]();
      brand d -= random b;
      holler\\_a[1] || (b[0] < 88 ? false : true)_/;
    `,
    expected: dedent`
      let a_1 = [true,false,true];
      let b_2 = [10,(a_1.length - 20),30];
      let c_3 = [];
      let d_4 = ((a=>a[~~(Math.random()*a.length)])(b_2));
      console.log((a_1[1] || (((b_2[0] < 88)) ? (false) : (true))));
    `,
  },
  {
    name: "ranches",
    source: `
      ranch S -x-x-x-x- x: int -x-x-x-x-
      tag x -= S\\_3_/;
      holler\\_x.x_/;
    `,
    expected: dedent`
      class S_1 {
      constructor(x_2) {
      this["x_2"] = x_2;
      }
      }
      let x_3 = new S_1(3);
      console.log((x_3["x_2"]));
    `,
  },
  {
    name: "optionals",
    source: `
      tag x -= no int;
      tag y -= x ?? 2;
      ranch S -x-x-x-x- x: int -x-x-x-x-
      tag z -= someodd S\\_1_/;
      tag w -= z?.x;
    `,
    expected: dedent`
      let x_1 = undefined;
      let y_2 = (x_1 ?? 2);
      class S_3 {
      constructor(x_4) {
      this["x_4"] = x_4;
      }
      }
      let z_5 = new S_3(1);
      let w_6 = (z_5?.["x_4"]);
    `,
  },
  {
    name: "for loops",
    source: `
      for i in 1..<50 ~~{
        holler\\_i_/;
      }
      for j in [10, 20, 30] ~~{
        holler\\_j_/;
      }
      repeat 3 ~~{
        // hello
      }
      for k in 1...10 ~~{
      }
    `,
    expected: dedent`
      for (let i_1 = 1; i_1 < 50; i_1++) {
        console.log(i_1);
      }
      for (let j_2 of [10,20,30]) {
        console.log(j_2);
      }
      for (let i_3 = 0; i_3 < 3; i_3++) {
      }
      for (let k_4 = 1; k_4 <= 10; k_4++) {
      }
    `,
  },
  {
    name: "standard library",
    source: `
      tag x -= 0.5;
      holler\\_sin\\_x_/ - cos\\_x_/ + exp\\_x_/ * ln\\_x_/ / hypot\\_2.3, x_/_/;
      holler\\_bytes\\_"∞§¶•"_/_/;
      holler\\_codepoints\\_"💪🏽💪🏽🖖👩🏾💁🏽‍♀️"_/_/;
    `,
    expected: dedent`
      let x_1 = 0.5;
      console.log(((Math.sin(x_1) - Math.cos(x_1)) + ((Math.exp(x_1) * Math.log(x_1)) / Math.hypot(2.3,x_1))));
      console.log([...Buffer.from("∞§¶•", "utf8")]);
      console.log([...("💪🏽💪🏽🖖👩🏾💁🏽‍♀️")].map(s=>s.codePointAt(0)));
    `,
  },
]

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(optimize(analyze(parse(fixture.source))))
      assert.deepEqual(actual, fixture.expected)
    })
  }
})