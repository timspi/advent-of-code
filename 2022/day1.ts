import { Solver } from './solver';

const solver = new Solver(data => {
    const elves = data.split('\n\n');

    const caloriesPerElf = elves.map(elf => elf.split('\n').reduce((acc, val) => acc + Number(val), 0));
    caloriesPerElf.sort((a, b) => b - a);

    return caloriesPerElf;
});

solver.part1 = caloriesPerElf => caloriesPerElf[0];
solver.part2 = caloriesPerElf => caloriesPerElf[0] + caloriesPerElf[1] + caloriesPerElf[2];

solver.test(`1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
`, 24000, 45000);

solver.run();
