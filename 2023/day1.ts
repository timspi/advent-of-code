import { ROWS, Solver } from "./solver";

const solver = new Solver(ROWS);

solver.part1 = data => {
    return data.reduce((acc, val) => {
        const digits = [...val.matchAll(/\d/g)];
        return acc + Number(digits[0][0] + digits[digits.length - 1][0]);
    }, 0);
};

solver.part2 = data => {
    const conv = (str: string) => {
        const ind = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'].indexOf(str);
        return ind >= 0 ? ind + 1 : str;
    };

    return data.reduce((acc, val) => {
        const digits = [...val.matchAll(/(\d|one|two|three|four|five|six|seven|eight|nine)/g)];
        const first = digits[0][0], last = digits[digits.length - 1][0];
        return acc + Number(`${conv(first)}${conv(last)}`);
    }, 0);
};

solver.test(`1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`, 142);

solver.test(`two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`, false, 281);

solver.run();
