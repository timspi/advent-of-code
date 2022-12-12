import { Solver } from './solver';

const solver = new Solver(data => {
    const mapArr = data.split('\n').map(line => line.split(''));

    let peak: [number, number] = [0, 0];
    const map: { [key: string]: string } = {};
    for (let row = 0; row < mapArr.length; row++) {
        for (let col = 0; col < mapArr[0].length; col++) {
            map[`${col},${row}`] = mapArr[row][col];
            if (mapArr[row][col] === 'E') {
                peak = [col, row];
            }
        }
    }
    return { map, peak };
});

solver.part1 = ({ map, peak }) => findPath(map, peak, 'S');
solver.part2 = ({ map, peak }) => findPath(map, peak, 'a');

function findPath(map: { [key: string]: string }, start: [number, number], endSymbol: string) {
    let depth = 0;
    const visited = new Set<string>();

    let locations: [number, number][] = [start];
    while (1) {
        depth++;

        // check all possible locations
        const nextLocations: [number, number][] = [];
        for (let loc of locations) {
            const curr = `${loc[0]},${loc[1]}`;

            const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            for (let dir of dirs) {
                const next = `${loc[0] + dir[0]},${loc[1] + dir[1]}`;
                if (!visited.has(next) && getElevation(map[curr]) - getElevation(map[next]) <= 1) {
                    visited.add(next);
                    const Lx = loc[0] + dir[0], Ly = loc[1] + dir[1]
                    if (map[next] === endSymbol) {
                        return depth;
                    }
                    nextLocations.push([Lx, Ly]);
                }
            }
        }
        locations = nextLocations;
    }
    return 0;
}

function getElevation(ele: string) {
    switch (ele) {
        case 'S': return 0;
        case 'E': return 25;
        default: return 'abcdefghijklmnopqrstuvwxyz'.indexOf(ele);
    }
}

solver.test(`Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`, 31, 29);

solver.run();
