import { Solver } from "./solver";
import { add, getCoordsBounds, getMapBounds, parseMapString, s2p } from "./util/map";

const solver = new Solver();

// north, south, west, east
const dirs = [
    [[0, 1], [-1, 1], [1, 1]], // north
    [[0, -1], [-1, -1], [1, -1]], // south
    [[-1, 0], [-1, -1], [-1, 1]], // west
    [[1, 0], [1, -1], [1, 1]] // east
];

solver.part1 = data => {
    const map = parseMapString(data, '.');
    let positions = Object.keys(map).map(str => s2p(str));

    Solver.log(positions);

    for (let round = 0; round <= 10; round++) {
        const newPositions: { pos: number[], valid: boolean }[] = [];
        const oldPositions: number[][] = [];

        for (let pos of positions) {
            for (let d = 0; d < 4; d++) {
                if (dirs[(round + d) % 4].every(dir => !map[add(pos, dir).join()])) {
                    const index = newPositions.findIndex(el => el.pos === pos);
                    if (index >= 0) {
                        newPositions[index].valid = false;
                        oldPositions.push(newPositions[index].pos, pos);
                    } else {
                        newPositions.push({ pos, valid: true });
                        break;
                    }
                }
            }
        }

        positions = [...oldPositions, ...newPositions.filter(el => el.valid).map(el => el.pos)];
        // TODO: update map

        Solver.log(round, positions);
    }

    const { height, width } = getCoordsBounds(positions);
    return height * width - positions.length;
};

solver.test(`.....
..##.
..#..
.....
..##.
.....`, 25);

solver.test(`..............
..............
.......#......
.....###.#....
...#...#.#....
....#...##....
...#.###......
...##.#.##....
....#..#......
..............
..............
..............`, 110);
