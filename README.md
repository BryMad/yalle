# YALL\*E

![](docs/logo.png)

### A LoneStar Codin' Experience

Experts have prophesied that American regional dialects will one day be extinct. YALL\*E is a coding language for anyone who (like me) grew up hearin' the soothing sounds of a Texas drawl and will miss it when it's gone. It also lets you infuse the wild-west, rootin-tootin' LoneStar spirit to your hoity-toity, city-fied code.

<br>

<br>

# Features

- Your basic types: int, float, string, boolean.
- Type constructors: arrays, structures, optionals, functions
- A user-accessible bottom type, void.
- A user-accessible top type, any.
- Statically typed
- Variables are typed "Texas Strongly" w/ no implicit type conversions.
- Type inference for local variables
- Types must be declared for empty arrays and empty optionals
- First-class functions
- No explicit pointers
- operators for optionals (?., ?[], ??)

- Yalle is completely null-safe. 

- Basic type constructors: arrays, ranches (aka structs), optionals, tasks (aka functions).

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


More information about how to type in Yalle can be found on the WEBSITE

//TODO





