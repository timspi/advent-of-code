import { ROWS, Solver } from "./solver";

const solver = new Solver(input => {
    const data = ROWS(input);

    const numbers: { [id: number]: { count: boolean, value: number } } = {};
    let numberId = 0;
    const positions = data.map(line => {
        let row = new Array<number | false>(line.length).fill(false);

        for (const number of line.matchAll(/\d+/g)) {
            numbers[++numberId] = { count: false, value: Number(number) };
            for (let i = 0; i < number[0].length; i++) {
                row[(number.index || 0) + i] = numberId;
            }
        }

        return row;
    });

    Solver.log(positions);
    Solver.log(numbers);

    return { numbers, data, positions }
});

solver.part1 = ({ numbers, data, positions }) => {

    for (let y = 0; y < data.length; y++) {
        for (const symbol of data[y].matchAll(/(?![\d\.])./g)) { // negative lookahead to match all but "." and digits
            const x = symbol.index || -1;

            // check all adjacent positions
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const entry = positions[y + dy]?.[x + dx];
                    if (entry) numbers[entry].count = true;
                }
            }
        }
    }

    return Object.values(numbers).filter(num => num.count).reduce((acc, num) => acc + num.value, 0);
}

solver.part2 = ({ numbers, data, positions }) => {

    let gearRatioSum = 0;

    for (let y = 0; y < data.length; y++) {
        for (const symbol of data[y].matchAll(/\*/g)) {
            const x = symbol.index || -1;
            const adjNums = new Set<number>();

            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const entry = positions[y + dy]?.[x + dx];
                    if (entry) adjNums.add(entry);
                }
            }

            if (adjNums.size === 2) {
                Solver.log('found gear ', adjNums);
                const [g1, g2] = [...adjNums];
                gearRatioSum += numbers[g1].value * numbers[g2].value;
            }
        }
    }

    return gearRatioSum;
}


solver.test(`467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`, 4361, 467835);

solver.run();
