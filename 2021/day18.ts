import { readFileSync } from 'fs';
import { basename } from 'path';

const data = readFileSync('data/' + basename(__filename, '.ts'), 'utf-8').split('\n').map(conv);

// part1
const part1 = data.reduce((a, b) => add(a, b));
console.log(magnitude(part1));

// part2
let maxMagnitude = 0;
for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
        if (i === j) continue;

        const mag = magnitude(add(data[i], data[j]));
        if (mag > maxMagnitude) maxMagnitude = mag;
    }
}
console.log(maxMagnitude);


// #########################

function conv(num: string) {
    return [...num.matchAll(/(\[|\]|,|\d+)/g)].map(match => match[0]);
}

function add(num1: string[], num2: string[]) {
    const sum = ['[', ...num1, ',', ...num2, ']'];
    return reduce(sum);
}

function reduce(num: string[]): string[] {
    while (1) {
        try {
            num = explode(num);
            // console.log('explode: ' + num.join(''));
        } catch (e) {
            // no explode happened -> try split
            try {
                num = split(num);
                // console.log('split: ' + num.join(''));
            } catch (e) {
                // neither explode nor split happened -> we're done
                return num;
            }
        }
    }
    return [];
}

function explode(num: string[]) {
    let level = 0;
    let lastNum = -1;
    for (let i = 0; i < num.length; i++) {
        if (num[i] === '[') {
            level++;
        } else if (num[i] === ']') {
            level--;
        } else if (num[i] !== ',') {
            // reached a digit
            if (level > 4 && num[i + 1] === ',') {
                // explode
                const left = Number(num[i]);
                const right = Number(num[i + 2]);

                let nextNum = i + 3;
                while (isControlCharachter(num[nextNum])) nextNum++;

                if (num[lastNum]) {
                    num[lastNum] = `${Number(num[lastNum]) + left}`;
                }
                if (num[nextNum]) {
                    num[nextNum] = `${Number(num[nextNum]) + right}`;
                }
                return [...num.slice(0, i - 1), '0', ...num.slice(i + 4)];
            }
            lastNum = i;
        }
    }
    throw 'no explode';
}

function split(num: string[]): string[] {
    for (let i = 0; i < num.length; i++) {
        if (!isControlCharachter(num[i])) {
            const val = Number(num[i]);

            if (val >= 10) {
                // split
                const half = val / 2;
                return [...num.slice(0, i), '[', `${Math.floor(half)}`, ',', `${Math.ceil(half)}`, ']', ...num.slice(i + 1)];
            }
        }
    }
    throw 'no split';
}

function isControlCharachter(char: string) {
    return char === '[' || char === ']' || char === ',';
}

function magnitude(value: string[]) {
    let num = value.join('');
    while (isNaN(Number(num))) {
        let matches = [...num.matchAll(/\[(\d+),(\d+)\]/g)];
        for (let m of matches) {
            num = num.replace(m[0], `${3 * Number(m[1]) + 2 * Number(m[2])}`);
        }
    }
    return Number(num);
}
