import { ROWS, Solver } from "./solver";

const solver = new Solver(ROWS);

solver.part1 = data => {
    const { map, maxY } = parseData(data);

    let sand = [500, 0];
    let sandCounter = 0;
    while (sand[1] <= maxY) {
        sand = [500, 0];
        while (sand[1] <= maxY) {
            if (!map[[sand[0], sand[1] + 1].join()]) {
                sand[1]++;
            } else if (!map[[sand[0] - 1, sand[1] + 1].join()]) {
                sand[0]--;
                sand[1]++;
            } else if (!map[[sand[0] + 1, sand[1] + 1].join()]) {
                sand[0]++;
                sand[1]++;
            } else {
                sandCounter++;
                map[sand.join()] = 'o';
                break;
            }
        }
    }
    Solver.log(map);
    return sandCounter;
}

solver.part2 = data => {
    const { map, maxY } = parseData(data);

    let sand = [0, 0];
    let sandCounter = 0;
    while (sand.join() !== '500,0') {
        sand = [500, 0];
        while (true) {
            if (!check(sand[0], sand[1] + 1)) {
                sand[1]++;
            } else if (!check(sand[0] - 1, sand[1] + 1)) {
                sand[0]--;
                sand[1]++;
            } else if (!check(sand[0] + 1, sand[1] + 1)) {
                sand[0]++;
                sand[1]++;
            } else {
                sandCounter++;
                map[sand.join()] = 'o';
                break;
            }
        }
    }
    function check(x: number, y: number) {
        if (y >= maxY + 2) return true;
        return map[[x, y].join()]
    }

    Solver.log(map);
    return sandCounter;
}

function parseData(data: string[]) {
    const map: { [coord: string]: string } = {};
    for (let path of data) {
        const points = path.split(' -> ').map(pt => pt.split(',').map(num => Number(num)));
        for (let p = 0; p < points.length - 1; p++) {
            const start = points[p], end = points[p + 1];
            const coordinateIndex = start[0] === end[0] ? 1 : 0;
            const len = end[coordinateIndex] - start[coordinateIndex];
            for (let delta = 0; delta <= Math.abs(len); delta++) {
                const coord = [0, 0];
                coord[coordinateIndex] = start[coordinateIndex] + Math.sign(len) * delta;
                coord[1 - coordinateIndex] = start[1 - coordinateIndex];
                map[coord.join()] = '#';
            }
        }
    }
    let maxY = -Infinity;
    for (let coord of Object.keys(map)) {
        const y = Number(coord.split(',')[1]);
        if (y > maxY) maxY = y;
    }

    return { map, maxY }
}

solver.test(`498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`, 24, 93);

solver.run();