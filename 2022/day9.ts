import { ROWS, Solver } from "./solver";

type Rope = [number, number][];

const solver = new Solver(ROWS);

solver.part1 = moves => {
    const rope: Rope = [[0, 0], [0, 0]];
    const tailPositions = new Set();

    for (let move of moves) {
        let [dir, count] = move.split(' ');

        for (let c = 0; c < Number(count); c++) {
            switch (dir) {
                case 'R': rope[0][Direction.X]++; break;
                case 'L': rope[0][Direction.X]--; break;
                case 'U': rope[0][Direction.Y]++; break;
                case 'D': rope[0][Direction.Y]--; break;
            }
            calcMove(rope, 1);
            Solver.log(`moved ${dir} | ${rope[0]} | ${rope[1]}`);

            tailPositions.add(`${rope[1]}`);
        }
    }

    return tailPositions.size;
};

solver.part2 = moves => {
    const rope: Rope = [];
    for (let i = 0; i < 10; i++) {
        rope[i] = [0, 0];
    }

    const tailPositions = new Set();

    for (let move of moves) {
        let [dir, count] = move.split(' ');

        for (let c = 0; c < Number(count); c++) {
            switch (dir) {
                case 'R': rope[0][Direction.X]++; break;
                case 'L': rope[0][Direction.X]--; break;
                case 'U': rope[0][Direction.Y]++; break;
                case 'D': rope[0][Direction.Y]--; break;
            }
            for (let i = 1; i < 10; i++) {
                calcMove(rope, i);
            }
            Solver.log(`moved ${dir} | ${rope[0]} | ${rope[9]}`);

            tailPositions.add(`${rope[9]}`);
        }
        // printTestField(rope);
    }

    return tailPositions.size;
};

enum Direction { X = 0, Y = 1 };
function calcMove(rope: Rope, i: number) {
    const dx = rope[i - 1][Direction.X] - rope[i][Direction.X];
    const dy = rope[i - 1][Direction.Y] - rope[i][Direction.Y];

    if (Math.abs(dx) >= 2 || Math.abs(dy) >= 2) {
        rope[i][Direction.X] += Math.sign(dx);
        rope[i][Direction.Y] += Math.sign(dy);
    }
}

// function printTestField(rope: Rope) {
//     const field = `..........................
// ..........................
// ..........................
// ..........................
// ..........................
// ..........................
// ..........................
// ..........................
// ..........................
// ..........................
// ..........................
// ..........................
// ..........................
// ..........................
// ..........................
// ...........s..............
// ..........................
// ..........................
// ..........................
// ..........................
// ..........................`.split('\n').map(line => line.split(''));
//     for (let i = 0; i < 10; i++) {
//         const [x, y] = rope[i];
//         field[15 - y][x + 11] = i === 0 ? 'H' : `${i}`;
//     }
//     Solver.log(field.map(line => line.join('')).join('\n'));
//     Solver.log();
// }

solver.test(`R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`, 13, 1);

solver.test(`R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`, 88, 36);

solver.run();
