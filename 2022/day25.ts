import { ROWS, Solver } from "./solver";

const solver = new Solver(ROWS);

type Digit = '=' | '-' | '0' | '1' | '2';
const values = {
    '=': -2,
    '-': -1,
    '0': 0,
    '1': 1,
    '2': 2,
};
const valuesBack: { [key: string]: Digit } = {
    '-2': '=',
    '-1': '-',
    '0': '0',
    '1': '1',
    '2': '2',
};

solver.part1 = data => {
    let sum = 0;
    for (const snafu of data) {
        const dec = snafu2dec(snafu);
        sum += dec;
        Solver.log(snafu, dec, dec2snafu(dec));
    }
    return dec2snafu(sum);
};

function snafu2dec(num: string) {
    let acc = 0;
    for (let i = 0; i < num.length; i++) {
        const val = values[num[num.length - i - 1] as Digit];
        acc += val * Math.pow(5, i);
    }
    return acc;
}

function dec2snafu(num: number) {
    let conv = '';
    while (num !== 0) {
        let rem = num % 5;
        if (rem > 2) rem -= 5;
        conv = valuesBack[String(rem)] + conv;
        num = (num - rem) / 5;
    }
    return conv;
}

solver.test(`1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`, '2=-1=0');

solver.run();
