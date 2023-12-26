import { Solver } from "./solver";
import { Bounds, Field } from "../util/field";
import { runCycles } from "../util/cache";

const solver = new Solver();

solver.part1 = data => {
    const map = data.split('\n').map(line => line.split(''));

    let sum = 0;
    for (let x = 0; x < map[0].length; x++) {
        let weight = map.length;
        for (let y = 0; y < map.length; y++) {
            const el = map[y][x];
            if (el === 'O') {
                sum += weight;
                weight--;
            } else if (el === '#') {
                weight = map.length - y - 1;
            }
        }
    }

    return sum;
};

solver.part2 = data => {
    const field = new Field();
    field.parseMapString(data);
    const bounds = field.getBounds();

    Solver.log(field.toMapString() + '\n\n');

    // let cycles = 3;
    // while (cycles-- > 0) {
    //     cycle(field, bounds);
    //     Solver.log(field.toMapString() + '\n\n');
    // }

    const res = runCycles(1000000000, cycle, field, bounds);
    Solver.log(res);

    // Calculate the weight from the map string
    const endCoords = res.hash.split('|');
    let sum = 0;
    for (const entry of endCoords) {
        const [coord, obj] = entry.split(':');
        if (obj === 'O') {
            const [x, y] = coord.split(',');
            sum += bounds.maxY - Number(y) + 1;
        }
    }

    return sum;
}

function cycle(field: Field, bounds: Bounds) {
    move(field, 1, [bounds.minX, bounds.minY], [bounds.maxX, bounds.maxY]); // north
    move(field, 0, [bounds.minX, bounds.maxY], [bounds.maxX, bounds.minY]); // west
    move(field, 1, [bounds.maxX, bounds.maxY], [bounds.minX, bounds.minY]); // south
    move(field, 0, [bounds.maxX, bounds.minY], [bounds.minX, bounds.maxY]); // east
    return field.toString();
}

// coordIndex: if 0, move along x axis; if 1, move along y axis
function move(field: Field, coordIndex: number, from: [number, number], to: [number, number]) {
    const outerDelta = Math.sign(to[coordIndex] - from[coordIndex]);
    const innerDelta = Math.sign(to[1 - coordIndex] - from[1 - coordIndex]);
    for (let outer = from[coordIndex] + outerDelta; outer !== to[coordIndex] + outerDelta; outer += outerDelta) { // skip first
        for (let inner = from[1 - coordIndex]; inner !== to[1 - coordIndex] + innerDelta; inner += innerDelta) {
            const coord: number[] = [];
            coord[coordIndex] = outer;
            coord[1 - coordIndex] = inner;
            // Solver.log(coord);

            const el = field.get(...coord as [number, number]);
            if (el === 'O') {
                let nextCoord = coord.slice();
                do {
                    nextCoord[coordIndex] -= outerDelta;
                } while (nextCoord[coordIndex] !== from[coordIndex] - outerDelta && !field.has(...nextCoord as [number, number]));
                nextCoord[coordIndex] += outerDelta;
                if (nextCoord[coordIndex] !== coord[coordIndex]) {
                    field.set(...nextCoord as [number, number], 'O');
                    field.delete(...coord as [number, number]);
                }
            }
        }
    }
}

solver.test(`O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`, 136, 64);

solver.run();
