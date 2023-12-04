import { arr } from "./array";
import { forEachPair, forEachPairWithNegatives, forEachPermutation } from "./for-each"
import { match, matchNumbers, split } from "./split";

// for-each.ts

console.log('For each pair:');
forEachPair([1, 2, 3], (a, b) => console.log(a, b))

console.log('\nFor each pair with negatives:');
forEachPairWithNegatives([1, 2, 3], (a, b) => console.log(a, b))

console.log('\nFor each permutation:');
forEachPermutation([1, 2, 3], permutation => console.log(permutation))


// array.ts

console.log('\n\nInitialize array:');
console.log(arr(3));

console.log('\nInitialize array with static value:');
console.log(arr(3, 'Foo'));

console.log('\nInitialize array with function:');
console.log(arr(3, i => Math.pow(2, i)));


// split.ts

console.log('\n\nSplit into parts:');
console.log(split('Hello: Foo | Bar', ': ', ' | '));

console.log('\nMatch regular expression:');
console.log(match('abc123, foo: 42  |  bar  4!2', /\w+/g));

console.log('\nMatch numbers:');
console.log(matchNumbers('1sa2ad3  foo 241   bar  4!2'));
