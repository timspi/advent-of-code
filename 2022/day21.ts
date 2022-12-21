import assert from "assert";
import { ROWS, Solver } from "./solver";

const solver = new Solver(ROWS);

solver.part1 = data => {
    const numbers: { [key: string]: number } = {};

    const monkeys: { id: string, m1: string, op: string, m2: string }[] = [];
    for (const line of data) {
        const [id, num] = line.split(': ');
        if (isNaN(Number(num))) {
            const [m1, op, m2] = num.split(' ');
            monkeys.push({ id, m1, op, m2 });
        } else {
            numbers[id] = Number(num);
        }
    }

    let index = 0;
    while (monkeys.length > 0) {
        if (index >= monkeys.length) index = 0;
        const { id, m1, op, m2 } = monkeys[index];
        if (numbers[m1] !== undefined && numbers[m2] !== undefined) {
            const res = calc(numbers[m1], op, numbers[m2]);
            numbers[id] = res;
            Solver.log('setting monkey %s to %d', id, res);
            monkeys.splice(index, 1);
        } else {
            index++;
        }
    }

    return numbers['root'];
};

solver.part2 = data => {
    const numbers: { [key: string]: number } = {};

    const monkeys: { [id: string]: { m1: string, op: string, m2: string } } = {};
    for (const line of data) {
        const [id, num] = line.split(': ');
        if (id === 'humn') continue;
        if (isNaN(Number(num))) {
            const [m1, op, m2] = num.split(' ');
            monkeys[id] = { m1, op, m2 };
        } else {
            numbers[id] = Number(num);
        }
    }

    let left = buildEquation(monkeys['root'].m1);
    let right = buildEquation(monkeys['root'].m2);

    type Equation = string | number | [Equation, string, Equation];
    function buildEquation(monkey: string): Equation {
        if (monkey === 'humn') return monkey;

        if (numbers[monkey] !== undefined) {
            return numbers[monkey];
        } else {
            const m = monkeys[monkey];
            const eq1 = buildEquation(m.m1);
            const eq2 = buildEquation(m.m2);
            if (typeof eq1 === 'number' && typeof eq2 === 'number')
                return calc(eq1, m.op, eq2);

            return [eq1, m.op, eq2];
        }
    }

    Solver.log(JSON.stringify(left) + ' = ' + right); // 'humn' only appears once on left side of equation

    // solve equation iteratively while keeping right side a number
    while (left !== 'humn') {
        assert(typeof left === 'object');
        assert(typeof right === 'number');

        let [eq1, op, eq2] = left;
        if (typeof eq1 === 'number') {
            if (op === '-' || op === '/') {
                // e.g. 8 / (humn - 3) = 2 -> humn - 3 = 4
                left = eq2;
                right = calc(eq1, op, right);
            } else {
                // e.g. 8 * (humn - 3) = 16 -> humn - 3 = 2
                left = eq2;
                right = calc(right, inv(op), eq1);
            }
        } else {
            // e.g. (humn - 3) / 4 = 2 -> humn - 3 = 8
            left = eq1;
            right = calc(right, inv(op), eq2 as number);
        }
    }

    return right as number;
}

function inv(op: string) {
    switch (op) {
        case '+': return '-';
        case '-': return '+';
        case '*': return '/';
        case '/': return '*';
    }
    throw new Error('op not supported');
}

function calc(n1: number, op: string, n2: number) {
    switch (op) {
        case '+': return n1 + n2;
        case '-': return n1 - n2;
        case '*': return n1 * n2;
        case '/': return n1 / n2;
    }
    throw new Error('op not supported');
}

solver.test(`root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`, 152, 301);

solver.run();
