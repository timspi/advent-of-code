import { Graph, getShortestPath } from "../util/shortest-path";
import { Solver } from "./solver";

const solver = new Solver();


// Modified Djikstra

type Dir = 'l' | 'r' | 'u' | 'd';
const dirs: [number, number, Dir][] = [[1, 0, 'r'], [-1, 0, 'l'], [0, 1, 'd'], [0, -1, 'u']];
const oppositeDir: Record<Dir, Dir> = {
    'l': 'r',
    'r': 'l',
    'u': 'd',
    'd': 'u',
};

interface Edge { to: string, weight: number, dir: Dir }
interface Node { edges: Edge[], distance: number, prev?: string, dirIn?: Dir };

solver.part1 = data => {
    let end!: string;
    const nodes = new Map<string, Node>();
    data.split('\n').forEach((line, y, rows) => {
        for (let x = 0; x < line.length; x++) {
            const edges: Edge[] = [];
            for (const [dx, dy, dir] of dirs) {
                const to = [x + dx, y + dy];
                const weight = rows[to[1]]?.[to[0]];
                if (weight !== undefined) edges.push({ to: to.join(), weight: Number(weight), dir });
            }
            end = [x, y].join();
            nodes.set(end, { distance: y === 0 && x === 0 ? 0 : Infinity, edges });
        }
    });

    const remainingNodes = [...nodes.entries()];

    while (remainingNodes.length) {
        // Sort by current distance (ascending)
        remainingNodes.sort((a, b) => a[1].distance - b[1].distance);

        const [str, node] = remainingNodes.splice(0, 1)[0];
        if (str === end) break;

        for (const edge of node.edges) {
            // check going back not possible
            if (node.dirIn && oppositeDir[node.dirIn] === edge.dir) continue;

            // check for straight line
            let curr = node;
            let depth: number;
            const predecessors: Node[] = [];
            for (depth = 0; depth < 3; depth++) {
                predecessors.push(curr);
                if (!curr.prev) break;
                curr = nodes.get(curr.prev) as Node;
            }
            // skip this edge if alredy walked this way 3 nodes
            if (predecessors.every(p => p.dirIn === edge.dir)) continue;

            if (remainingNodes.find(([s]) => s === edge.to)) {
                // update distance
                const altDist = node.distance + edge.weight;
                const to = nodes.get(edge.to) as Node;
                if (altDist < to.distance) {
                    to.distance = altDist;
                    to.prev = str;
                    to.dirIn = edge.dir;
                }
            }
        }
    }

    // console.log(nodes);

    const path = [end];
    let node: string = end;
    while (node !== '0,0') {
        node = nodes.get(node)?.prev as string;
        path.push(node);
    }
    console.log({ path: path.reverse(), weight: nodes.get(end)?.distance as number });

    return nodes.get(end)?.distance as number;
};



/*
enum Direction {
    Up,
    Down,
    Left,
    Right
}

function turnLeft(dir: Direction) {
    switch (dir) {
        case Direction.Up: return Direction.Left;
        case Direction.Right: return Direction.Up;
        case Direction.Down: return Direction.Right;
        case Direction.Left: return Direction.Down;
    }
}

function turnRight(dir: Direction) {
    switch (dir) {
        case Direction.Up: return Direction.Right;
        case Direction.Right: return Direction.Down;
        case Direction.Down: return Direction.Left;
        case Direction.Left: return Direction.Up;
    }
}

interface Coords {
    x: number;
    y: number;
}

function move(coords: Coords, dir: Direction, distance = 1) {
    switch (dir) {
        case Direction.Up: coords.y -= distance; break;
        case Direction.Right: coords.x += distance; break;
        case Direction.Down: coords.y += distance; break;
        case Direction.Left: coords.x -= distance; break;
    }
    return { x: coords.x, y: coords.y };
}

type Dir = 'l' | 'r' | 'u' | 'd';
// type Path = [[number, number], Dir, Dir, number, number];
interface Option {
    x: number;
    y: number;
    dir: Direction;
    // previousDir: Direction | false;
    heatLossToHere: number;
    straightLineCounter: number;
}

solver.part1 = data => {
    const map = data.split('\n').map(line => line.split('').map(heatLoss => ({ heatLoss: Number(heatLoss), minHeatLossToHere: { [Direction.Left]: Infinity, [Direction.Right]: Infinity, [Direction.Up]: Infinity, [Direction.Down]: Infinity } })));

    let opts: Option[] = [
        { x: 0, y: 0, dir: Direction.Right, heatLossToHere: 0, straightLineCounter: 0 },
        { x: 0, y: 0, dir: Direction.Down, heatLossToHere: 0, straightLineCounter: 0 }
    ];
    while (opts.length > 0) {
        const nextOpts: Option[] = [];
        Solver.log('\n\nwork on ' + opts.length);

        for (const opt of opts) {
            if (opt.straightLineCounter > 3) continue;

            const obj = map[opt.y]?.[opt.x];
            if (!obj) continue;

            // if (obj.minHeatLossToHere[opt.dir] <= opt.heatLossToHere) continue;
            // obj.minHeatLossToHere[opt.dir] = opt.heatLossToHere;

            Solver.log(`checking ${opt.x},${opt.y} | ${opt.dir} | ${opt.heatLossToHere}`);


            for (const dir of [opt.dir, turnLeft(opt.dir), turnRight(opt.dir)]) {

                const nextOpt = { ...opt };
                move(nextOpt, dir);
                nextOpt.heatLossToHere += obj.heatLoss;
                if (dir)
                    nextOpts.push();
            }
            // Continue straight
            nextOpts.push({ ...move(opt, opt.dir), dir: opt.dir, heatLossToHere: opt.heatLossToHere + obj.heatLoss, straightLineCounter: opt.straightLineCounter + 1 });

            // Turn left
            const left = turnLeft(opt.dir);
            nextOpts.push({ ...move(opt, left), dir: left, heatLossToHere: opt.heatLossToHere + obj.heatLoss, straightLineCounter: 0 });

            // Turn right
            const right = turnRight(opt.dir);
            nextOpts.push({ ...move(opt, right), dir: right, heatLossToHere: opt.heatLossToHere + obj.heatLoss, straightLineCounter: 0 });
        }
        opts = nextOpts;
    }

    // Solver.log(JSON.stringify(map, undefined, 2));
    Solver.log(map[map.length - 1][map[0].length - 1]);

    return Math.min(...Object.values(map[map.length - 1][map[0].length - 1].minHeatLossToHere)) - map[0][0].heatLoss;
};




class DirectionCl {
    dx = 0;
    dy = 0;

    constructor(dx: number, dy: number) {
        this.dx = dx;
        this.dy = dy;
    }

    turnRight() {

    }

    static Up = new DirectionCl(0, -1);
    static Down = new DirectionCl(0, 1);
    static Left = new DirectionCl(0, 1);
    static Right = new DirectionCl(0, 1);
}
*/

/*
Call stack size exceeded
solver.part1 = data => {
    const map = data.split('\n').map(line => line.split('').map(heatLoss => ({ heatLoss: Number(heatLoss), minHeatLossToHere: Infinity, path: [] as [number, number][] })));
    const end = map.at(-1)?.at(-1);
    const paths = [];

    // while (!end?.steps) {
    // }
    const move = (pos: [number, number], prevDir: 'l' | 'r' | 'u' | 'd', heatLossToHere: number, straightLineCounter: number, path: [number, number][]) => {
        if (straightLineCounter >= 3) return;

        const obj = map[pos[1]]?.[pos[0]];
        if (!obj) return;

        if (obj.minHeatLossToHere <= heatLossToHere) return;
        obj.minHeatLossToHere = heatLossToHere;
        path.push(pos);
        obj.path = path.slice();

        const nextHl = heatLossToHere + obj.heatLoss;
        if (prevDir !== 'l') move([pos[0] + 1, pos[1]], 'r', nextHl, prevDir === 'r' ? straightLineCounter + 1 : 0, path.slice()); // move right
        if (prevDir !== 'r') move([pos[0] - 1, pos[1]], 'l', nextHl, prevDir === 'l' ? straightLineCounter + 1 : 0, path.slice()); // move left
        if (prevDir !== 'd') move([pos[0], pos[1] - 1], 'u', nextHl, prevDir === 'u' ? straightLineCounter + 1 : 0, path.slice()); // move up
        if (prevDir !== 'u') move([pos[0], pos[1] + 1], 'd', nextHl, prevDir === 'd' ? straightLineCounter + 1 : 0, path.slice()); // move down
    };
    move([0, 0], 'r', 0, 0, []);

    Solver.log(end?.path);

    return (end?.minHeatLossToHere || 0) - 2;
};
*/

// type Path = [[number, number], 'l' | 'r' | 'u' | 'd', number, number, string[]];

// solver.part1 = data => {
//     const map = data.split('\n').map(line => line.split('').map(heatLoss => ({ heatLoss: Number(heatLoss), minHeatLossToHere: { l: Infinity, r: Infinity, u: Infinity, d: Infinity }, prev: [] as string[] })));
//     const end = map.at(-1)?.at(-1);

//     let paths: Path[] = [[[0, 0], '' as any, 0, 0, []]];
//     while (paths.length > 0) {
//         const nextPaths: Path[] = [];
//         for (const path of paths) {
//             const [pos, prevDir, heatLossToHere, straightLineCounter, prev] = path;

//             if (straightLineCounter > 3) continue;

//             const obj = map[pos[1]]?.[pos[0]];
//             if (!obj) continue;

//             if (obj.minHeatLossToHere[prevDir] <= heatLossToHere) continue;

//             obj.minHeatLossToHere[prevDir] = heatLossToHere;

//             const nextHl = heatLossToHere + (prev.includes(pos.join()) ? 0 : obj.heatLoss);
//             prev.push(pos.join());
//             obj.prev = prev.slice();

//             if (prevDir !== 'l') nextPaths.push([[pos[0] + 1, pos[1]], 'r', nextHl, prevDir === 'r' ? straightLineCounter + 1 : 1, prev.slice()]); // move right
//             if (prevDir !== 'r') nextPaths.push([[pos[0] - 1, pos[1]], 'l', nextHl, prevDir === 'l' ? straightLineCounter + 1 : 1, prev.slice()]); // move left
//             if (prevDir !== 'd') nextPaths.push([[pos[0], pos[1] - 1], 'u', nextHl, prevDir === 'u' ? straightLineCounter + 1 : 1, prev.slice()]); // move up
//             if (prevDir !== 'u') nextPaths.push([[pos[0], pos[1] + 1], 'd', nextHl, prevDir === 'd' ? straightLineCounter + 1 : 1, prev.slice()]); // move down
//         }
//         paths = nextPaths;
//     }

//     // Solver.log(JSON.stringify(map, undefined, 2));
//     Solver.log(map[map.length - 1][map[0].length - 1]);

//     return Math.min(...Object.values(map[map.length - 1][map[0].length - 1].minHeatLossToHere)) - map[0][0].heatLoss;
// };

// type Dir = 'l' | 'r' | 'u' | 'd';
// type Path = [[number, number], Dir, Dir, number, number];

// solver.part1 = data => {
//     const map = data.split('\n').map(line => line.split('').map(heatLoss => ({ heatLoss: Number(heatLoss), minHeatLossToHere: { l: Infinity, r: Infinity, u: Infinity, d: Infinity } })));

//     let paths: Path[] = [
//         [[0, 0], '' as any, 'none' as any, 0, 0]
//     ];
//     while (paths.length > 0) {
//         const nextPaths: Path[] = [];
//         Solver.log('\n\nwork on ' + paths.length);

//         for (const path of paths) {
//             const [pos, dir, prevDir, heatLossToHere, straightLineCounter] = path;

//             if (straightLineCounter > 3) continue;

//             const obj = map[pos[1]]?.[pos[0]];
//             if (!obj) continue;

//             if (obj.minHeatLossToHere[dir] <= heatLossToHere) continue;

//             Solver.log('checking ' + pos.join() + ' ' + dir + ' ' + prevDir);

//             obj.minHeatLossToHere[dir] = heatLossToHere;

//             const nextHl = heatLossToHere + obj.heatLoss;
//             const counter = dir === prevDir ? straightLineCounter + 1 : 1;
//             if (prevDir !== 'l') nextPaths.push([[pos[0] + 1, pos[1]], 'r', dir, nextHl, counter]); // move right
//             if (prevDir !== 'r') nextPaths.push([[pos[0] - 1, pos[1]], 'l', dir, nextHl, counter]); // move left
//             if (prevDir !== 'd') nextPaths.push([[pos[0], pos[1] - 1], 'u', dir, nextHl, counter]); // move up
//             if (prevDir !== 'u') nextPaths.push([[pos[0], pos[1] + 1], 'd', dir, nextHl, counter]); // move down
//         }
//         paths = nextPaths;
//     }

//     // Solver.log(JSON.stringify(map, undefined, 2));
//     Solver.log(map[map.length - 1][map[0].length - 1]);

//     return Math.min(...Object.values(map[map.length - 1][map[0].length - 1].minHeatLossToHere)) - map[0][0].heatLoss;
// };



/*
solver.part1 = data => {
    // build a graph
    const graph: Graph = { edges: [], nodes: [] };
    const map = data.split('\n');
    const width = map[0].length;
    const height = map.length;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const heatLoss = Number(map[y][x]);

            for (const prevDir of ['l', 'r', 'u', 'd']) {
                for (const dir of ['l', 'r', 'u', 'd']) {
                    if (dir === 'l' && prevDir === 'r') continue;
                    if (dir === 'r' && prevDir === 'l') continue;
                    if (dir === 'u' && prevDir === 'd') continue;
                    if (dir === 'd' && prevDir === 'u') continue;

                    const nX = dir === 'l' ? x - 1 : dir === 'r' ? x + 1 : x;
                    const nY = dir === 'u' ? y - 1 : dir === 'd' ? y + 1 : y;

                    graph.edges.push({ from: [x, y, prevDir].join(), to: [nX, nY, dir].join(), weight: heatLoss });
                }
            }
        }
    }
    graph.nodes = Object.keys(graph.edges);

    return Math.min(...['l', 'r', 'u', 'd'].map(dir => {
        return getShortestPath(graph, '0,0,r', [width - 1, height - 1, dir].join()).weight;
    }));


    // for (let x = 0; x < width; x++) {
    //     for (let y = 0; y < height; y++) {
    //         const heatLoss = Number(map[y][x]);

    //         // each node is defined by x, y, dir
    //         for (const prevDir of ['l', 'r', 'u', 'd']) {
    //             for (const dir of ['l', 'r', 'u', 'd']) {
    //                 // if (dir === 'l' && newDir === 'r') continue;
    //                 // if (dir === 'r' && newDir === 'l') continue;
    //                 // if (dir === 'u' && newDir === 'd') continue;
    //                 // if (dir === 'd' && newDir === 'u') continue;

    //                 for (let i = 1; i <= 3; i++) {
    //                     // add this node
    //                     // graph.nodes.push(`${x},${y},${dir},${i}`);

    //                     const nX = dir === 'l' ? x - i : dir === 'r' ? x + i : x;
    //                     const nY = dir === 'u' ? y - i : dir === 'd' ? y + i : y;

    //                     if (nX >= 0 && nX < width && nY >= 0 && nY < height) {
    //                         const straightLineCount = dir === newDir ? HELP : 0;
    //                         graph.edges.push({ from: `${nX},${nY},${dir},${i}`, to: '', weight: heatLoss });

    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
    // return 0;
}
*/

// solver.test(`2413432311323
// 3215453535623
// 3255245654254
// 3446585845452
// 4546657867536
// 1438598798454
// 4457876987766
// 3637877979653
// 4654967986887
// 4564679986453
// 1224686865563
// 2546548887735
// 4322674655533`, 102);

solver.test(`11599
99199
99199
99199
99111`, 16);

// 11599
// 99199
// 99199
// 99199
// 99111

// 11111111111111
// 11111111111111
// 11111111111111
// 66999999999999
// 66999999999999
// 66999999999999
// 66999999999999
// 66999999999999
// 11999999999999
// 91999999999999
// 11999999999999
// 59999999999999
// 11111111111111
// 11111111111111

solver.run(); // 714 is too high, 703 is too high | apparently should be 684
