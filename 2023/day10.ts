import { Solver } from "./solver";

enum Field {
    Up,
    Down,
    Left,
    Right,
    UpToLeft,
    DownToLeft,
    UpToRight,
    DownToRight,
    LeftToUp,
    LeftToDown,
    RightToUp,
    RightToDown,
}

const solver = new Solver(data => {
    const map = data.split('\n');
    let Sx = -1, Sy: number;
    for (Sy = 0; Sy < map.length; Sy++) {
        Sx = map[Sy].indexOf('S');
        if (Sx >= 0) break;
    }
    return { map, Sx, Sy };
});

solver.part1 = data => findMainLoop(data).length / 2;

interface Norm {
    up: [number, number];
    down: [number, number];
    left: [number, number];
    right: [number, number];
}

solver.part2 = data => {
    const mainLoop = findMainLoop(data);
    Solver.log(mainLoop);

    // Create a map with just the main loop
    const map: number[][] = Array(data.map.length).fill(0).map(() => Array(data.map[0].length).fill(0));
    for (const [x, y] of mainLoop) {
        map[y][x] = 1;
    }
    Solver.log(map.map(line => line.join('')).join('\n'));


    const norm1: Norm = {
        'up': [1, 0],
        'down': [-1, 0],
        'left': [0, -1],
        'right': [0, 1],
    };

    const norm2: Norm = {
        'up': [-1, 0],
        'down': [1, 0],
        'left': [0, 1],
        'right': [0, -1],
    };


    let count = -1;
    try {
        // First try to check for fields to the right of the loop
        count = countArea(mainLoop, map.map(line => line.slice()), norm1);
    } catch (err) {
        console.log('catch', err);
        // If that landed outside at some point, try to the left of the loop
        count = countArea(mainLoop, map.map(line => line.slice()), norm2);
    }

    return count;
};

function findMainLoop({ map, Sx, Sy }: { map: string[], Sx: number, Sy: number }) {
    const startDirs: [string, number, number][] = [
        ['^', Sx, Sy - 1],
        ['v', Sx, Sy + 1],
        ['<', Sx - 1, Sy],
        ['>', Sx + 1, Sy],
    ];
    for (const startDir of startDirs) {
        let [dir, x, y] = startDir;
        let run = true;
        const path: [number, number, Field][] = [];
        while (run) {
            const c = map[y]?.[x];
            if (!c) break;
            switch (c + dir) {
                case '|^': path.push([x, y, Field.Up]); y--; break;
                case '|v': path.push([x, y, Field.Down]); y++; break;

                case '-<': path.push([x, y, Field.Left]); x--; break;
                case '->': path.push([x, y, Field.Right]); x++; break;

                case 'F<': path.push([x, y, Field.LeftToDown]); y++; dir = 'v'; break;
                case 'F^': path.push([x, y, Field.UpToRight]); x++; dir = '>'; break;

                case '7>': path.push([x, y, Field.RightToDown]); y++; dir = 'v'; break;
                case '7^': path.push([x, y, Field.UpToLeft]); x--; dir = '<'; break;

                case 'J>': path.push([x, y, Field.RightToUp]); y--; dir = '^'; break;
                case 'Jv': path.push([x, y, Field.DownToLeft]); x--; dir = '<'; break;

                case 'L<': path.push([x, y, Field.LeftToUp]); y--; dir = '^'; break;
                case 'Lv': path.push([x, y, Field.DownToRight]); x++; dir = '>'; break;

                default: run = false;
            }
            if (c === 'S') {
                switch (startDir[0] + dir) {
                    case '^^': path.push([x, y, Field.Up]); break;
                    case 'vv': path.push([x, y, Field.Down]); break;
                    case '<<': path.push([x, y, Field.Left]); break;
                    case '>>': path.push([x, y, Field.Right]); break;

                    case 'v<': path.push([x, y, Field.DownToLeft]); break;
                    case 'v>': path.push([x, y, Field.DownToRight]); break;
                    case '>v': path.push([x, y, Field.LeftToDown]); break;
                    case '>^': path.push([x, y, Field.LeftToUp]); break;
                    case '<v': path.push([x, y, Field.RightToDown]); break;
                    case '<^': path.push([x, y, Field.RightToUp]); break;
                    case '^<': path.push([x, y, Field.UpToLeft]); break;
                    case '^>': path.push([x, y, Field.UpToRight]); break;
                }
            }
            // Solver.log(x, y, map[y][x]);
        }
        // Solver.log(x, y, map[y][x], path.length);
        if (path.length > 1) return path;
    }
    throw "no loop found";
}

function countArea(mainLoop: [number, number, Field][], map: number[][], norm: Norm) {
    const getDirs = (f: Field) => {
        switch (f) {
            case Field.Up: return [norm.up];
            case Field.Down: return [norm.down];
            case Field.Left: return [norm.left];
            case Field.Right: return [norm.right];

            case Field.DownToLeft: return [norm.down, norm.left];
            case Field.DownToRight: return [norm.down, norm.right];
            case Field.LeftToDown: return [norm.left, norm.down];
            case Field.LeftToUp: return [norm.left, norm.up];
            case Field.RightToDown: return [norm.right, norm.down];
            case Field.RightToUp: return [norm.right, norm.up];
            case Field.UpToLeft: return [norm.up, norm.left];
            case Field.UpToRight: return [norm.up, norm.right];
        }
    };
    // Follow path and count area
    for (const [x, y, dir] of mainLoop) {
        for (const [dx, dy] of getDirs(dir)) {
            let d = 1;
            let pos: number;
            while (1 !== (pos = map[y + d * dy]?.[x + d * dx])) {
                Solver.log(pos, x + d * dx, y + d * dy);
                if (pos === undefined) throw "this is the outside";
                map[y + d * dy][x + d * dx] = 2;
                d++;
            }
        }
    }
    Solver.log(map.map(line => line.join('')).join('\n'));
    return ([] as number[]).concat(...map).filter(el => el === 2).length;
}

solver.test(`.....
.S-7.
.|.|.
.L-J.
.....`, 4);

solver.test(`..F7.
.FJ|.
SJ.L7
|F--J
LJ...`, 8);

solver.test(`...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`, false, 4);

solver.test(`FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJIF7FJ-
L---JF-JLJIIIIFJLJJ7
|F|F-JF---7IIIL7L|7|
|FFJF7L7F-JF7IIL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`, false, 10);

solver.run();
