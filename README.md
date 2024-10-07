![](docs/logo.png)

### A LoneStar Codin' Experience

Experts have prophesied that American regional dialects will one day be extinct. YALL\*E is a coding language for anyone who (like me) grew up hearin' the soothing sounds of a Texas drawl and will miss it if it ever disappears. Yalle also lets you infuse the wild-west, rootin-tootin' LoneStar spirit to your hoity-toity, city-fied code.

<br>

<br>

# Building

Use NodeJS to build and run this language. Make sure your versions are up to date because Yalle uses the newest-fangled modern JavaScript.

Clone the repo, run `npm install`. Now you're off to the races!

# Usage

To run from the command line:

```
node src/yalle.js <filename> <outputType>
```

"outputType" tells the robot in your computer how you want it to print your output. The options are:

<table>
<tr><th>Option</th><th>Description</th></tr>
<tr><td>parsed</td><td>A message indicating the syntax is ok</td></tr>
<tr><td>analyzed</td><td>The program representation</td></tr>
<tr><td>optimized</td><td>The optimized representation</td></tr>
<tr><td>js</td><td>code translation to JavaScript</td></tr>
<tr><td>js |  node </td><td>pipe output into node to compile and run</td></tr>
</table>

Here are some examples you can do straight out the gate from a cloned repo.

Get an "analyzed" program representation of the file:

```
$ node src/yalle.js examples/ranches.yalle analyzed
```

See the file converted to JavaScript:

```
$ node src/yalle.js examples/ranches.yalle js
```

Run the file to calculate the stocking rate of a ranch:

```
node src/yalle.js examples/ranches.yalle js | node
```

<br>
<br>

# The Basics

Yalle has...

- Your basic types: int, float, string, boolean.
- Type constructors: arrays, ranches (aka structs), optionals, and tasks (aka functions)
- a bottom type `void`, for when you need a type that don't have a type
- a top any type `any` to corral all kinds of types
- Statically typed
- "Texas Strong"ly Typed w/ no implicit type conversions.
- Type inference for local variables
- Yalle is completely null-safe.
  <br>
  <br>

# Programs

A program in Yalle is a sequence of statements. Each must be terminated with a `;`.
<br>
<br>

# Variables

Yalle's variables come in two flavors: `tags` and `brands`.

Just like a tag on a cow's ear can be swapped out, variables declared with `tag` are writable and can be changed.

Meanwhile brands are for life, so variables declared with `brand` are not writable. You're stuck with 'em!

In keeping with the Texas theme, the variable assignment operator is bit more of a cattle prod/brand shape `-=` vs. your usual equals sign. We promise no real cows were hurt the making of this language!

Variables directly store values for booleans, numbers, and strings, but only hold references to arrays, ranches, tasks, and optionals.

```
tag yearsSinceAlamo -= 187;              // writable tag
brand alamoYear -= 1836;                 // non-writable brand

yearsSinceAlamo -= yearsSinceAlamo + 1;  // tag re-assigned
// alamoYear -= 1776                     // error! Brands are for life!
```

<br>
<br>

# Tasks

Workin' on the land, you've got your chores which break down into simple tasks, which is why we call our functions `tasks`. All tasks must be named. No anonymous functions 'round here.

Task declarations and invocations are a bit ugly, but we had to get a shoutout to the official state mammal of Texas: the majestic longhorn.

So instead of parens to house your parameters when declaring a function, you use the left and right horns of a longhorn `\_` and `_/`. If you've got parameters to list out inside those horns, their ids get connected to their type with an underscore `_` (you must have one underscore, but you can add as many as you like to make the longhorns even longer!). An optional return type can be specified after the longhorns are "closed" and uses the more classic colon `:` syntax. Multiple params are still sepearated with commas `,`.

Tasks are also invoked using longhorn magic as well `\__/`.

```
task addNine\_num_int_/: int      // Longhorn params, w/ return type
    ~~{ roundup num + 9; }
task double\_num_______int_/: int // Overly long longhorns allowed!
    ~~{ roundup num * 2; }

holler\_double\_addNine\_1_/_/_/;  // 20
```

It obviously can get a little messy when invocations are geting nested (since horns don't look as nice nested as parentheses), but sometimes chaos is the price you gotta pay to go big!
<br>
<br>

# Ranches

Ranches are structs in Yalle.

Following the theme of making things bigger (and arguably more complicated!), Ranches need to be declared with barbed wire `-x-x-x-x-` to stake your claim:

```
ranch RanchInfo
    -x-x-x-x-
        acres: float
        cattle: float
    -x-x-x-x-
```

Ranches can then be created by initializing them with their type name. Don't forget the cattle prod assignment operator or the longhorn invocation:

```
brand KingRanch -= RanchInfo\_825000.0, 35000.0_/;
```

<br>
<br>

# Lasso Statements

We call Block Statements "Lasso Statements" because their curly brackets need a `~~` to make them look more lasso like:

```
iffin' (chipsLevel < 1) addNine\_num_int_/: int
    ~~{ roundup num + 9; }
```

<br>
<br>

# Control Flow and Other Keywords

Yalle has control flow with `iffin` statements (if), `otherwise` statements (else), and `till` statements (while).

You break loops with a `whoa`.

You print with a `holler`.

You return with a `roundup`.
