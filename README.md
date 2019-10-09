# tiny-partial

[![source](https://badgen.net/npm/v/@ngard/tiny-partial)](https://www.npmjs.com/package/@ngard/tiny-partial)
[![bundle size](https://badgen.net/bundlephobia/minzip/@ngard/tiny-partial)](https://bundlephobia.com/result?p=@ngard/tiny-partial)
[![build status](https://badgen.net/travis/NickGard/tiny-partial)](https://travis-ci.org/NickGard/tiny-partial)
[![license](https://badgen.net/badge/license/MIT/blue)](https://badgen.net/badge/license/MIT/blue)

A minimal-weight utility similar to `lodash.partial`. For when every byte counts!

<hr/>

lodash.partial [![bundle size](https://badgen.net/bundlephobia/minzip/lodash.partial)](https://bundlephobia.com/result?p=lodash.partial)
<br/>
tiny-partial [![bundle size](https://badgen.net/bundlephobia/minzip/@ngard/tiny-partial)](https://bundlephobia.com/result?p=@ngard/tiny-partial)

<hr/>

## Syntax

```js
partial(/* function [, arity] */)
partial._ // a placeholder for subsequent invocations
```

The `partial._` placeholder can be used in place of any argument that will be supplied later. The next invocation of the returned function will fill those placeholders in first, then add arguments to the end of the list of arguments. Upon invoking the original function, any placeholders not filled with be converted to `undefined`

## Parameters

`function` - A function to wrap.
<br/>
`arity` - A (positive integer) count of how many arguments to expect. Defaults to the function length.

## Return

A function that takes any number of arguments and either returns another function to gather more arguments or, if the number of argments meets or exceeds the arity, the result of the original function with those arguments applied. The returned function(s) each have a `.value()` method that will force the original function to be called with the currently gathered arguments.

## Example

```javascript
import { partial } from '@ngard/tiny-partial';

function add(a, b) { return a + b; }
// add.length = 2, the number of arguments it expects

const partialAdd = partial(add);
const addTwo = partialAdd(2);

console.log(addTwo(5)); // logs '7'
```

```javascript
import { partial } from '@ngard/tiny-partial';

function greet(name, title = 'Your Lordship') {
  return `Good day,  ${name}, ${title}`;
}
// greet.length = 1, because defaulted arguments are not 'expected'

const partialGreet = partial(greet, 2);
const greetBob = partialGreet('Bob');

console.log(greetBob('my friend')); // logs 'Good day, Bob, my friend'
console.log(greetBob()); // logs 'Good day, Bob, Your Lordship'
```

```javascript
import { partial } from '@ngard/tiny-partial';

function sum(...numbers) {
  return numbers.reduce((total, number) => total + number);
}
// sum.length = 0, because rest arguments are not 'expected'

const partialSum = partial(sum, Infinity);

// call `.value()` on an infinite partial function to call the
// original function with the gathered arguments
const total = partialSum(1)(2, 3)(4).value();

console.log(total); // logs '10'
```

```javascript
import { partial } from '@ngard/tiny-partial';

function log(...statements) {
  console.log('logging', ...statements);
}

const partialLog = partial(log, Infinity);
const { _ } = partial;

partialLog('hello', 'world')(',', 'my', 'name', 'is')('Nick').value() // "hello world, my name is Nick
// use placeholders to change order
partialLog('hello', _, ', my name is', _, '!')('Fred')('Nick').value() // "hello Fred, my name is Nick!
```
