import { assert } from "console";
import { runCycles, runWithCache } from "../cache";

// ################### runWithCache ###################

let counter: number;

// Run without cache
counter = 0;
for (let i = 0; i < 20; i++) {
    someOperation(i % 3);
}
assert(counter === 20, 'reference test failed');

// Run with cache
counter = 0;
const op = runWithCache(someOperation);
for (let i = 0; i < 20; i++) {
    op(i % 3);
}
assert(counter === 3, 'cache not working');

function someOperation(index: number): number {
    counter++;
    return index * 17 % 256;
}



// ################### runCycles ###################

let withoutCache = { val: 'abc123' };
for (let i = 0; i < 10000; i++) {
    periodicOperation(withoutCache);
}

let withCache = { val: 'abc123' };
const res = runCycles(10000, periodicOperation, withCache);


assert(withoutCache.val === res.hash, 'actual result and predicted result differ');

function periodicOperation(input: { val: string }): string {
    input.val = input.val.slice(1) + input.val[0];
    return input.val;
}
