import { Solver } from "./solver";
import { Map, Dir, Pos } from "../util/map";

const solver = new Solver();

/*
enum Dir {
    Up = 'u',
    Down = 'd',
    Left = 'l',
    Right = 'r'
}

function turnLeft(dir: Dir) {
    switch (dir) {
        case Dir.Up: return Dir.Left;
        case Dir.Right: return Dir.Up;
        case Dir.Down: return Dir.Right;
        case Dir.Left: return Dir.Down;
    }
}

function turnRight(dir: Dir) {
    switch (dir) {
        case Dir.Up: return Dir.Right;
        case Dir.Right: return Dir.Down;
        case Dir.Down: return Dir.Left;
        case Dir.Left: return Dir.Up;
    }
}

interface Coords {
    x: number;
    y: number;
}

function move({ x, y }: Coords, dir: Dir, distance = 1) {
    switch (dir) {
        case Dir.Up: y -= distance; break;
        case Dir.Right: x += distance; break;
        case Dir.Down: y += distance; break;
        case Dir.Left: x -= distance; break;
    }
    return { x, y };
}

// type Path = [[number, number], Dir, Dir, number, number];
interface Option {
    x: number;
    y: number;
    dir: Dir;
    straightLineCount: number;
    // path: string[];
}

solver.part1 = data => {
    const map = data.split('\n').map(line => line.split('').map(c => Number(c)));
    const endX = map[0].length - 1;
    const endY = map.length - 1;

    const optsPerHeatLoss: Option[][] = [];
    optsPerHeatLoss[0] = [
        { x: 1, y: 0, dir: Dir.Right, straightLineCount: 0 },
        { x: 0, y: 1, dir: Dir.Down, straightLineCount: 0 }
    ];

    const visited: string[] = [];

    Solver.log(endX, endY);


    let heatLoss = 0;
    while (true) {
        Solver.log(heatLoss);
        for (const opt of optsPerHeatLoss[heatLoss] || []) {
            // Check straight line
            if (opt.straightLineCount >= 3) continue;

            // Check if on map
            const num = map[opt.y]?.[opt.x];
            if (!num) continue;

            // Check if already visited
            const state = `${opt.x},${opt.y},${opt.dir},${opt.straightLineCount}`;
            if (visited.includes(state)) continue;
            visited.push(state);

            const nextHeatLoss = heatLoss + Number(num);
            // Solver.log('nextHeatLoss', nextHeatLoss)
            if (opt.x === endX && opt.y === endY) return nextHeatLoss;

            if (!optsPerHeatLoss[nextHeatLoss]) optsPerHeatLoss[nextHeatLoss] = [];

            // Continue straight
            optsPerHeatLoss[nextHeatLoss].push({ ...move(opt, opt.dir), dir: opt.dir, straightLineCount: opt.straightLineCount + 1 });

            // Turn left
            const left = turnLeft(opt.dir);
            optsPerHeatLoss[nextHeatLoss].push({ ...move(opt, left), dir: left, straightLineCount: 0 });

            // Turn right
            const right = turnRight(opt.dir);
            optsPerHeatLoss[nextHeatLoss].push({ ...move(opt, right), dir: right, straightLineCount: 0 });
        }
        heatLoss++;
    }
};*/

interface Option {
    pos: Pos;
    dir: Dir;
    straightLineCount: number;
    path: Pos[];
}

solver.part1 = data => run(data, 0, 3);
solver.part2 = data => run(data, 4, 10);

function run(data: string, min: number, max: number) {
    const map = new Map(data, el => Number(el));
    const end = map.endPos();

    const optsPerHeatLoss: Option[][] = [];
    optsPerHeatLoss[0] = [
        { pos: new Pos(0, 0), dir: Dir.Right, straightLineCount: 0, path: [] }
    ];

    const visited: string[] = [];

    let heatLoss = 0;
    loop: while (heatLoss < 1000) {
        if (heatLoss % 10 === 0) console.log(heatLoss / 10 + ' %');
        // Solver.log('\n' + heatLoss + ': # of opts is ' + (optsPerHeatLoss[heatLoss]?.length || 0));

        for (const opt of optsPerHeatLoss[heatLoss] || []) {
            opt.path.push(opt.pos);
            if (opt.pos.eq(end) && opt.straightLineCount >= min) {
                console.log('END', opt.pos, opt.dir, opt.straightLineCount, opt.path.join(' > '));
                break loop;
            }

            // Solver.log(opt);
            const tryDir = (dir: Dir, straightLineCount: number) => {
                const next: Option = {
                    pos: opt.pos.move(dir),
                    dir,
                    straightLineCount,
                    path: opt.path.slice()
                };

                // Check if on map
                if (!map.has(next.pos)) return;

                // Check if already visited
                const state = `${next.pos},${next.dir},${next.straightLineCount}`;
                if (visited.includes(state)) return;
                visited.push(state);
                Solver.log(state + ' | ' + opt.path.join('>'));

                const nextHeatLoss = heatLoss + Number(map.get(next.pos));
                if (!optsPerHeatLoss[nextHeatLoss]) optsPerHeatLoss[nextHeatLoss] = [];
                optsPerHeatLoss[nextHeatLoss].push(next);
            }

            if (opt.straightLineCount < max) {
                tryDir(opt.dir, opt.straightLineCount + 1);
            }

            if (opt.straightLineCount >= min) {
                tryDir(opt.dir.turnLeft(), 1);
                tryDir(opt.dir.turnRight(), 1);
            }

        }
        heatLoss++;
    }
    // console.log(optsPerHeatLoss);
    return heatLoss;
};



// solver.test(`11599
// 99199
// 99199
// 99199
// 99111`, 16);

// 11599
// 99199
// 99199
// 99199
// 99111



// solver.test(`11111111111111
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
// 11111111111111`, 66);

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



// solver.test(`111111111111
// 999999999991
// 999999999991
// 999999999991
// 999999999991`, false, 71);

// 111111111111
// 999999999991
// 999999999991
// 999999999991
// 999999999991



solver.test(`2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`, 102, 94);

// 0123456789012

// 2413432311323    2>>34^>>>1323
// 3215453535623    32v>>>35v5623
// 3255245654254    32552456v>>54
// 3446585845452    3446585845v52
// 4546657867536    4546657867v>6
// 1438598798454    14385987984v4
// 4457876987766    44578769877v6
// 3637877979653    36378779796v>
// 4654967986887    465496798688v
// 4564679986453    456467998645v
// 1224686865563    12246868655<v
// 2546548887735    25465488877v5
// 4322674655533    43226746555v>

















solver.run();
// part1: 714 is too high, 703 is too high | apparently should be 684
// part2: 823 is too high
