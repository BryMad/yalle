# YALL\*E

![](docs/logo.png)

### A LoneStar Codin' Experience

Experts have prophesied that American regional dialects will one day be extinct. YALL\*E is a coding language for anyone who (like me) grew up hearin' the soothing sounds of a Texas drawl and will miss it if it ever disappears. Yalle also lets you infuse the wild-west, rootin-tootin' LoneStar spirit to your hoity-toity, city-fied code.

<br>

<br>

# The Basics

- Your basic types: int, float, string, boolean.
- Type constructors: arrays, ranches (aka structs), optionals, tasks (aka functions)
- a bottom type void, for when you need a type that don't mean nothin’.
- a top any type any to corral all kinds of types
- Statically typed
- "Texas Strong"ly Typed w/ no implicit type conversions.
- Type inference for local variables
- Yalle is completely null-safe.

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

# DECLARATIONS

A declaration binds an id to an entity and can be used for types, functions, variables, parameters, iterators, and fields.

<!-- TODO examples -->

# VARIABLES

Variable store values and are type-constrained. Yalle's variables come in two flavors: `tags` and `brands`.

Just like a tag on a cow's ear can be swapped out, variables declared with `tag` are writable and can be changed.

And just like a brand is for life, variables declared with `brand` are not writable. You're stuck with 'em!

In keeping with the Texas theme, the variable assignment operator is bit more of a cattle prod/brand shape than your usual equals sign `-=`. But we promise no real cows were hurt the making of this language!

Variables directly store values for booleans, numbers, and strings, but only hold references to arrays, ranches, tasks, and optionals.

<!-- TODO EXAMPLES -->

# TASKS

Workin' on the land, you've your chores to do that break down into simple tasks, which is why we call our functions `tasks`. All tasks must be name and no anonymous functions.

Task declarations are a bit ugly, but we had to get some sort of shoutout to the official state mammal of Texas, the majestic longhorn.

So instead of parens to house your parameters when declaring a function, you use the left and right horns of a longhorn `\_` and `_/`. If you've got parameters to list out inside those horns, their ids get connected to their type with an underscore `_` just to make the longhorn even longer!

<!-- TODO EXAMPLES -->

Optional return types still use the more normal colon `:` syntax after the longhorn parameter list.

STRUCTS
