# Advent of Code

My solutions for [Advent of Code](https://adventofcode.com/).

If you want to use my framework for yourself, checkout the template branch which only includes the framework without my solutions.


## Usage
Since 2022, I am using Typescript and a self written `Solver` class that is used for every day and provides a framework that helps with working on the AoC problems.

The easiest way to run the code is by using `ts-node`. Install it with `npm i -g ts-node`.
Then, `cd` in the directory of the current year and run the implementation with `ts-node dayN` where N is the day:
```
Test for part1 passed
Test for part2 passed

Fetching puzzle input

Transformed input in 548µs

Result of part1: (calculated in 149µs)
123

Result of part2: (calculated in 2ms)
456
```

The Solver class adds some command line options, e.g. if you only want to run the tests, i.e. the examples given in the AoC problem description, run `ts-node dayN test`.
This also enables, if available, additional debug output (everything printed with `Solver.log()` instead of `console.log()`).

As requested by AoC, my puzzle inputs are not included in this repository. If you want to use this framework for yourself or run my solutions with your own puzzle input, you need to add your session token as described in **Authentication**.


**CLI usage**

When using the Solver class, some CLI options are automatically added:
- `ts-node dayN`: Run all tests and if all succeed, run all implemented parts and print the solutions.
- `ts-node dayN test`: Run all tests with additional debug output printed by `Solver.log(...)`.


**Authentication**

The Solver class enables automatic fetching of the puzzle input. For this, you need your AoC session token.
Login to [Advent of Code](https://adventofcode.com/) and then open the developer console (F12), go to Application -> Storage -> Cookies -> https://adventofcode.com and copy the value of the session cookie.
Then, create a file named `.env` with the following content:
```
SESSION_TOKEN=your-session-token
```

Now, the solver will download the puzzle input during the first execution and store it in `data/dayN`.


## Workflow
The basic workflow using the Solver class is as follows:
- Copy the file `template.ts` to `dayN.ts`
- Data preprocessing: Often, you need to apply some basic preprocessing to the input, which is the same for part1 and part2. At first, you don't know what exactly will be needed for part2, but most often a sensible parsing of the data can be reused in part2. Sometimes, this is as simple as splitting the input into an array of strings for each line. You can use one of the pre-defined transforms or write your own, for example:
```
const solver = new Solver(); // no transform
const solver = new Solver(ROWS); // split input in array of lines, i.e. split('\n')
const solver = new Solver(BLOCKS); // split input in array of blocks, i.e. split('\n\n')
const solver = new Solver(CSV); // split comma seperated input into an array, i.e. split(',')
const solver = new Solver(input => match(input, /Foo (\d+), Bar (\d+)/)); // use a custom function
const solver = new Solver(matchNumbers); // use one of the utility functions
```

- Next, start implementing part1 by setting `solver.part1` to a function that receives the transformed input from the previous step and returns the solution.
- Now you can add a test. Most likely AoC provided at least one example and its solution. Use the `solver.test` function. The first argument is the example input, the second argument the solution of part1. The third argument is optional and should be omitted for now as it is the solution of part2, which is not available yet.
- Run the program with `ts-node dayN`. As soon as the test passes, your puzzle input is fetched automatically and your solution is printed. Copy it to AoC and see if it's correct.

- When part2 is available, implement it by setting `solver.part2` to a function that receives the same transformed input as part1. Now, it might be necessary to move some of the logic from the transform function to part1 or vice-versa. In general, code that needs to be run for both part1 and part2 can go into the transform function and the rest into the individual functions for part1 and part2.
- If the same example is used as in part1, just add the solution as the third argument to the test function. Otherwise, you can specify another test. If you don't know the solution for part1, set the second argument to false and part1 is skipped for this test.


## Utility functions
This repository includes some self-written utility functions in the folder `util`.
See their JSDoc for more info on usage.
