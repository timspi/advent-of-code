import { FieldAnimation, Points } from "./util/field-animation";
import { ROWS, Solver } from "./solver";

const playAnimation = process.argv[2] === 'animate';

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

const animation = new FieldAnimation();

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
            if (playAnimation) animation.addFrame(conv(rope))
        }
    }

    return tailPositions.size;
};

function conv(rope: Rope): Points {
    const points: Points = {};
    for (let i = 0; i < 10; i++) {
        points[rope[i].join(',')] = i === 0 ? 'H' : `${i}`;
    }
    return points;
}

enum Direction { X = 0, Y = 1 };
function calcMove(rope: Rope, i: number) {
    const dx = rope[i - 1][Direction.X] - rope[i][Direction.X];
    const dy = rope[i - 1][Direction.Y] - rope[i][Direction.Y];

    if (Math.abs(dx) >= 2 || Math.abs(dy) >= 2) {
        rope[i][Direction.X] += Math.sign(dx);
        rope[i][Direction.Y] += Math.sign(dy);
    }
}

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

solver.run().then(() => {
    if (playAnimation) animation.play(60)
});
