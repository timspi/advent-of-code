import { BLOCKS, Solver } from "./solver";
import { drawMap, parseMapString } from "./util/map";

const solver = new Solver(BLOCKS);

solver.part1 = data => {
    const [boardStr, directionsStr] = data;
    const map = parseMapString(boardStr);

    let pos = [boardStr.indexOf('.'), 0];
    let dir = [1, 0];

    // Solver.log(pos);
    // Solver.log(drawMap(map));

    const directions = [...directionsStr.matchAll(/(\d+|R|L)/g)].map(el => el[0]);
    for (const direction of directions) {
        // Solver.log(direction);
        if (direction === 'R') {
            dir = [-dir[1], dir[0]];
        } else if (direction === 'L') {
            dir = [dir[1], -dir[0]];
        } else {
            const distance = Number(direction);
            for (let i = 0; i < distance; i++) {
                const next = add(pos, dir);

                const sym = map[next.join()];
                if (sym === '#') {
                    break;
                } else if (sym === undefined) {
                    // find other edge
                    let edge = pos.slice();
                    while (map[edge.join()] !== undefined) {
                        edge = sub(edge, dir);
                    }
                    edge = add(edge, dir);
                    if (map[edge.join()] === '.') {
                        pos = edge;
                    } else {
                        // wall
                        break;
                    }
                } else {
                    pos = next;
                }
            }
            // Solver.log(drawMap({ ...map, [pos.join()]: 'X' }));
        }
        // console.log(pos, dir);
    }

    return 4 * (pos[0] + 1) + 1000 * (pos[1] + 1) + ['1,0', '0,1', '-1,0', '0,-1'].indexOf(dir.join());
}

const dirArrows: { [key: string]: string } = {
    '-1,0': '<',
    '1,0': '>',
    '0,-1': '^',
    '0,1': 'v',
};

solver.part2 = data => {
    const [boardStr, directionsStr] = data;
    const map = parseMapString(boardStr);

    let pos = [boardStr.indexOf('.'), 0];
    let dir = [1, 0];

    // Solver.log(pos);
    // console.log(drawMap(map));
    const path = { ...map };

    // let counter = 0;
    const directions = [...directionsStr.matchAll(/(\d+|R|L)/g)].map(el => el[0]);
    for (const direction of directions) {
        // Solver.log(direction);
        if (direction === 'R') {
            dir = [-dir[1], dir[0]];
        } else if (direction === 'L') {
            dir = [dir[1], -dir[0]];
        } else {
            const distance = Number(direction);
            for (let i = 0; i < distance; i++) {
                const next = add(pos, dir);

                const sym = map[next.join()];
                if (sym === '#') {
                    break;
                } else if (sym === undefined) {
                    const [t, nextDir]: Transform = nextFaces[getFace(pos)][dir.join() as keyof Face] as any;
                    const edge = t(pos);
                    if (map[edge.join()] === '.') {
                        pos = edge;
                        dir = nextDir;
                    } else {
                        // wall
                        break;
                    }
                } else if (sym === '.') {
                    pos = next;
                } else {
                    throw new Error('unknown symbol at ' + next.join() + ': ' + sym);
                }
                // path[pos.join()] = counter.toString(36);
                // counter = (counter + 1) % 36;
                path[pos.join()] = dirArrows[dir.join()];
            }
            // console.log(drawMap({ ...path, [pos.join()]: 'X' }));
        }
        // console.log(pos, dir);
    }

    console.log(drawMap({ ...path, [pos.join()]: 'X' }));

    return 4 * (pos[0] + 1) + 1000 * (pos[1] + 1) + ['1,0', '0,1', '-1,0', '0,-1'].indexOf(dir.join());
}

function getFace([x, y]: number[]) {
    if (y < 50) return x < 100 ? 'A' : 'B';
    if (y < 100) return 'C';
    if (y < 150) return x < 50 ? 'D' : 'E';
    return 'F';
}

type Direction = [-1, 0] | [1, 0] | [0, -1] | [0, 1];
type Transform = [(arr: number[]) => number[], Direction];
interface Face {
    '-1,0': Transform;
    '1,0': Transform;
    '0,-1': Transform;
    '0,1': Transform;
}
const nextFaces: {
    [key: string]: Partial<Face>
} = {
    A: {
        '-1,0': [([x, y]) => ([0, 149 - y]), [1, 0]],
        '0,-1': [([x, y]) => ([0, x + 100]), [1, 0]],
    },
    B: {
        '1,0': [([x, y]) => ([99, 150 - y]), [-1, 0]],
        '0,-1': [([x, y]) => ([x - 100, 199]), [0, -1]],
        '0,1': [([x, y]) => ([99, 149 - y]), [-1, 0]],
    },
    C: {
        '-1,0': [([x, y]) => ([y - 50, 100]), [0, 1]],
        '1,0': [([x, y]) => ([y + 50, 49]), [0, -1]],
    },
    D: {
        '-1,0': [([x, y]) => ([50, 149 - y]), [1, 0]],
        '0,-1': [([x, y]) => ([50, x + 50]), [1, 0]],
    },
    E: {
        '1,0': [([x, y]) => ([149, 149 - y]), [-1, 0]],
        '0,1': [([x, y]) => ([49, x + 100]), [-1, 0]],
    },
    F: {
        '-1,0': [([x, y]) => ([y - 100, 0]), [0, 1]],
        '1,0': [([x, y]) => ([y - 100, 149]), [0, -1]],
        '0,1': [([x, y]) => ([x + 100, 0]), [0, 1]],
    },
}

function add(pos: number[], dir: number[]) {
    return [pos[0] + dir[0], pos[1] + dir[1]];
}

function sub(pos: number[], dir: number[]) {
    return [pos[0] - dir[0], pos[1] - dir[1]];
}

solver.test(`        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`, 6032);

solver.run();
