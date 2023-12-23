import { Graph, getShortestPath } from "../util/shortest-path";
import { Solver } from "./solver";

const solver = new Solver();

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

type Dir = 'l' | 'r' | 'u' | 'd';
type Path = [[number, number], Dir, Dir, number, number];

solver.part1 = data => {
    const map = data.split('\n').map(line => line.split('').map(heatLoss => ({ heatLoss: Number(heatLoss), minHeatLossToHere: { l: Infinity, r: Infinity, u: Infinity, d: Infinity } })));

    let paths: Path[] = [
        [[0, 0], '' as any, 'none' as any, 0, 0]
    ];
    while (paths.length > 0) {
        const nextPaths: Path[] = [];
        Solver.log('\n\nwork on ' + paths.length);

        for (const path of paths) {
            const [pos, dir, prevDir, heatLossToHere, straightLineCounter] = path;

            if (straightLineCounter > 3) continue;

            const obj = map[pos[1]]?.[pos[0]];
            if (!obj) continue;

            if (obj.minHeatLossToHere[dir] <= heatLossToHere) continue;

            Solver.log('checking ' + pos.join() + ' ' + dir + ' ' + prevDir);

            obj.minHeatLossToHere[dir] = heatLossToHere;

            const nextHl = heatLossToHere + obj.heatLoss;
            const counter = dir === prevDir ? straightLineCounter + 1 : 1;
            if (prevDir !== 'l') nextPaths.push([[pos[0] + 1, pos[1]], 'r', dir, nextHl, counter]); // move right
            if (prevDir !== 'r') nextPaths.push([[pos[0] - 1, pos[1]], 'l', dir, nextHl, counter]); // move left
            if (prevDir !== 'd') nextPaths.push([[pos[0], pos[1] - 1], 'u', dir, nextHl, counter]); // move up
            if (prevDir !== 'u') nextPaths.push([[pos[0], pos[1] + 1], 'd', dir, nextHl, counter]); // move down
        }
        paths = nextPaths;
    }

    // Solver.log(JSON.stringify(map, undefined, 2));
    Solver.log(map[map.length - 1][map[0].length - 1]);

    return Math.min(...Object.values(map[map.length - 1][map[0].length - 1].minHeatLossToHere)) - map[0][0].heatLoss;
};












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

solver.run(); // 714 is too high, 703 is too high | apparently should be 684
