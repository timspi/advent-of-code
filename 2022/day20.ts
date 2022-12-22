import { Solver } from "./solver";

const solver = new Solver();

solver.part1 = data => {
    let numbers = data.split('\n').map(num => Number(num));
    let out = numbers.map(num => ({ num, moved: false }));
    const len = out.length;

    let i = 0;
    while (i < out.length) {
        if (!out[i].moved) {
            const { num } = out.splice(i, 1)[0];
            let index = num + i;
            if (index <= 0) index += len - 1;
            if (index >= len - 1) index -= len - 1;
            out = [...out.slice(0, index), { num, moved: true }, ...out.slice(index)];

            if (index < i) i++;
        } else {
            i++;
        }
    }

    Solver.log(out);

    // const nextIndices: number[] = [];
    // for (const [i, num] of numbers.entries()) {
    //     let index = (i + num) % numbers.length;
    //     if (index < 0) index += numbers.length;
    //     nextIndices.push(index);
    // }
    // const nextNumbers = numbers.slice();
    // for (const [i, index] of nextIndices.entries()) {
    //     nextNumbers[index] = numbers[i];
    // }

    // console.log(nextNumbers);

    const offset = out.findIndex(el => el.num === 0);
    const sum = [1000, 2000, 3000].map(el => out[(el + offset) % len].num).reduce((a, b) => a + b);
    return sum;
}

solver.test(`1
2
-3
3
-2
0
4`, 3);

solver.run();
