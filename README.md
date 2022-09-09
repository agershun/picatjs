# picatjs - Picat and Prolog programming languages in JavaScript

# Work in Progress

This is a JavaScript implementation of subset of Picat and Prolog programming languages.

## What is Picat programming language?

Picat ([http://picat-lang.org/](http://picat-lang.org/)) is a simple, and yet powerful, logic-based multi-paradigm programming language aimed for general-purpose applications. It was created by Neng-Fa Zhou and Jonathan Fruhman. Originally it based on B-Prolog language.

Picat is a rule-based language, in which predicates, functions, and actors are defined with pattern-matching rules. Picat incorporates many declarative language features for better productivity of software development, including explicit non-determinism, explicit unification, functions, list comprehensions, constraints, and tabling. Picat also provides imperative language constructs, such as assignments and loops, for programming everyday things. 

Here is example of Picat program:
```prolog

	main => println(fact(100)).

	fact(1) = 1.
	fact(N), >(N,1) = *(N,fact(-(N,1))).

```

Due Picat (and this JS implementation) is based on Prolog language some Prolog programs are also allowed:
```prolog
	
	main(X,Y) :- son(X,Y).

	father(andrey,david).
	father(andrey,alex).
	son(X,Y) :- father(Y,X).


```

## JavaScript implementation

```js
	picat(<program>, <goal>, [<parameters array>], <flag>);
```

## Command line

```
	> picatjs <filename> [-g <goal>] [<parameters>...]
```

where:
* `filename` - file with Picat program (usually with \*.pi extension)
* `goal` - goal
* `parameters`


By default Picat calls `main` goal.

If you define goal wit `-g` flag the program will call `goal` goal.

You can define parameters:
```
	> picatjs one.pi 1 2 3
```

The program will call the goal `main(["1","2","3")`.


# Credits

The elegant multidisciple Picat language was designed by by Neng-Fa Zhou and Jonathan Fruhman.

This JavaScript implementation is based on the article [Solving riddles with Prolog and ES6 generators](https://curiosity-driven.org/prolog-interpreter) written by *Curiosity driven*. 

# License

This software is released under [MIT License](LICENSE)

# Author
Andrey Gershun

Copyright (c) 2022 Andrey Gershun
