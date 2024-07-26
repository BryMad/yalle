# YALL\*E

![](docs/logo.png)

### A LoneStar Codin' Experience

Experts have prophesied that American regional dialects will one day be extinct. YALL\*E is a coding language for anyone who (like me) grew up hearin' the soothing sounds of a Texas drawl and will miss it when it's gone. It's also for anyone lookin' to bring a bit of wild-west, rootin-tootin' LoneStar spirit to their hoity-toity, city-fied code.

<br>

<br>

# Features

- Your basic types: int, float, string, boolean.
- Variables are "Texas Strong"-ly typed w/ no implicit type conversions.
- Basic type constructors: arrays, ranches (aka structs), optionals, tasks (aka functions).
- A user-accessible bottom type, void.
- A user-accessible top type, any.
- Null-safe. No null value or null references. Just Optionals.
- Type inference for local variables.
- Texas dialect fun.
- Syntax that visually reinforces coding concepts. It's slightly cumbersome, but hopefully also fun for visual learners/more hands-on coders (like me!). EGs:
- - Assignments are "branded" with an `-=` rather than an `=` to emphasize it's an assignment, not pure "equality." 
- - Ranches (aka structs) are set aside with barbed wire `-x-x-x-x-` boundaries to reenforce the idea that they (once instantiated) are objects. 

## Programs

<br>
In Yalle, a program is a sequence of one or more statements. 
<br>
<br>

## Values and Types

All values are instances of a type. Yalle has these types:

- booleans: true and false.
- int: (unbounded) integers.
- float: IEEE-754 binary64 values.
- string: character strings.
- void: no instances at all.
- any: the union of all types.
- array types: written [T], whose instances are zero-based integer-indexed sequences of values of type T.
- ranches (aka struct) types, an ordered sequence of named fields.
- optional: written T?, representing “boxes” that either contain a value of type T or don't contain anything.
- tasks (aka functions): (T1,T2,...,Tn)->T0, consisting of all functions mapping (ordered) parameters of types T1 through Tn to a value of type T0.

Booleans, integers, floats, and strings have literal forms.

Values in an array expression must all have exactly the same type. Empty arrays must mention the intended type of the elements.

For optionals, use the some operator to create an optional with a present value. The operator no makes an empty optional on the given type.

There are no literals for functions; they have to be named:

There are no type expressions for struct types; structure types have to be declared and referred to only by name. Instances of struct types are created using the struct name as a constructor:



In Carlos, types are not first-class values. They can be named by identifiers, and you will see both type expressions and type names appear in the source code, but only in parameter declarations, the return type portion of a function declaration, in empty array expressions, with the no operator, and in casts. But you cannot assign them to variables or pass them to functions or return them from functions.



// TODO anything to make this less of a Carlos rip off? Rename variables? Change array syntax?


## Declarations

A declaration binds an identifier to an entity. There are six kinds of declarations:

- type declarations
- task (aka function) declarations
- variable declarations
- parameter declarations
- iterator declarations
- field declarations

<br>

<br>

## Tasks (functions)

## Ranches (structs)

## Variables

## Statements

## Expressions

## Syntax

## Standard Library

## Control Flow

### Iffin Statements

For conditionals, YALLE has `iffin` statements:

```
iffin [condition] ~~{ block ; }"
```

Blocks gets roped in by a swinging rope and a lasso loop `~~{}`

```
~~{ block here ; }
```

<br>

### Otherwise Statements

Iffin an iffin statement proves false and untrustworthy, and you want to follow it with something ELSE to do, use `otherwise`:

```
iffin time == supper ~~{ wrastle beans;}
otherwise ~~{ wrastle herd;}`
```

<br>

### While Statements

"While" sounds good in a Texas drawl, so why fix something that ain't broken.

```
while month < 9
~~{guadalupe_river_toobin = true;}
```

<br>

### Breaks

Break a till statement or any other process with a `whoa`

```
while picnic = true;
    iffin frito_pies < 0 ~~{ whoa ;}
```

<br>

## Return Statements

In YALLE, we don't return things, we `wrastle` 'em up:

```
iffin horsehoes < horses * 4 ~~{wrastle more_horse_shoes()}
```

<br>

## Print Statements

To print in YALLE, just ask it to holler something out:

```
holler "Howdy world!"
```

## Sample Programs

Still working on these. Sorry!



Normally in Texas, we're opposed to fencing people in, but when it comes to structs, you gotta corral your variables with enough length of barbed wire ("-x-x-x-") and wall 'em in on the sides ("|"). Sure, maybe it's a tad tedious, but also kind of fun to think of objects as actual roped off land objects.
