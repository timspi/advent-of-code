import { forEachPair } from "../util/for-each";
import { Vec } from "../util/vector";
import { Solver } from "./solver";

const solver = new Solver();

function evaluate(data: string, expansion: number) {
    const map = data.split('\n').map(line => line.split(''));
    const width = map[0].length;
    const height = map.length;

    const emptyRows: number[] = [];
    const emptyCols: number[] = [];
    const galaxies: Vec[] = [];
    for (let x = 0; x < width; x++) {
        let colEmpty = true;
        for (let y = 0; y < height; y++) {
            if (x === 0 && !map[y].includes('#')) emptyRows.push(y);

            if (map[y][x] === '#') {
                galaxies.push(new Vec(x, y));
                colEmpty = false;
            }
        }
        if (colEmpty) emptyCols.push(x);
    }
    Solver.log(emptyCols, emptyRows);

    // Expand
    galaxies.forEach(galaxy => {
        const expandBy = new Vec();
        for (const emptyRow of emptyRows) {
            if (emptyRow < galaxy.y) expandBy.y += expansion;
        }
        for (const emptyCol of emptyCols) {
            if (emptyCol < galaxy.x) expandBy.x += expansion;
        }
        galaxy.add(expandBy);
    });

    Solver.log(galaxies);

    let sum = 0;
    forEachPair(galaxies, (g1, g2) => {
        sum += g1.manhattanDistance(g2);
    });

    return sum;
}

solver.part1 = data => evaluate(data, 1);
solver.part2 = data => evaluate(data, 1000000 - 1);


solver.test(`...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`, 374);

solver.run();
