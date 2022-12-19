import { ROWS, Solver } from "./solver";

const solver = new Solver(ROWS);

solver.part1 = rows => {
    let counter = 0;
    for (const coord of rows) {
        for (const d of [-1, 1]) {
            if (!rows.includes(add(coord, d, 0, 0))) counter++;
            if (!rows.includes(add(coord, 0, d, 0))) counter++;
            if (!rows.includes(add(coord, 0, 0, d))) counter++;
        }
    }
    return counter;
};

solver.part2 = rows => {
    const bounds = [
        [Infinity, -Infinity],
        [Infinity, -Infinity],
        [Infinity, -Infinity]
    ];
    for (const row of rows) {
        const coords = row.split(',').map(el => Number(el));
        for (const index of [0, 1, 2]) {
            if (coords[index] < bounds[index][0]) bounds[index][0] = coords[index];
            if (coords[index] > bounds[index][1]) bounds[index][1] = coords[index];
        }
    }
    Solver.log(bounds);

    let counter = 0, last = -1;
    const outside = new Set<string>();
    while (last !== counter) {
        last = counter;
        counter = 0;
        for (const row of rows) {
            const coords = row.split(',').map(el => Number(el));

            for (const index of [0, 1, 2]) {
                for (const dir of [-1, 1]) {
                    const checked = isOutside(rows, bounds, coords, index, dir, outside);
                    if (checked) {
                        checked.forEach(el => outside.add(el));
                        counter++;
                    }
                }
            }
        }
    }

    return counter;
};

function isOutside(cubes: string[], bounds: number[][], coord: number[], index: number, dir: number, outside: Set<string>): false | string[] {
    const checkCoord = [...coord];
    const checked: string[] = [];
    if (dir === -1) {
        for (let d = checkCoord[index] - 1; d >= bounds[index][0]; d--) {
            checkCoord[index] = d;
            const coord = checkCoord.join();
            if (outside.has(coord)) break;

            checked.push(coord);
            if (cubes.includes(coord)) return false;
        }
    } else {
        for (let d = checkCoord[index] + 1; d <= bounds[index][1]; d++) {
            checkCoord[index] = d;
            const coord = checkCoord.join();
            if (outside.has(coord)) break;

            checked.push(coord);
            if (cubes.includes(coord)) return false;
        }
    }
    return checked;
}

function add(coord: string, dx: number, dy: number, dz: number) {
    const [x, y, z] = coord.split(',');
    return [Number(x) + dx, Number(y) + dy, Number(z) + dz].join();
}

solver.test(`1,1,1
2,1,1`, 10, 10);

solver.test(`2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`, 64, 58);

solver.run();
