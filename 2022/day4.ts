import { ROWS, Solver } from "./solver";

const solver = new Solver(ROWS);

solver.part1 = pairs => {
    let counter = 0;
    for (let pair of pairs) {
        const [elf1, elf2] = pair.split(',').map(elf => elf.split('-').map(val => Number(val)));
        if ((elf1[0] <= elf2[0] && elf1[1] >= elf2[1]) || (elf1[0] >= elf2[0] && elf1[1] <= elf2[1])) {
            counter++;
        }
    }
    return counter;
}

solver.part2 = pairs => {
    let counter = 0;
    for (let pair of pairs) {
        const [elf1, elf2] = pair.split(',').map(elf => elf.split('-').map(val => Number(val)));
        if ((elf1[0] >= elf2[0] && elf1[0] <= elf2[1]) || (elf2[0] >= elf1[0] && elf2[0] <= elf1[1])) {
            counter++;
        }
    }
    return counter;
}

solver.test(`2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`, 2, 4);

solver.run();
