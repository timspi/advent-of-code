import { Solver } from "./solver";

const solver = new Solver();

solver.part1 = data => findMarker(data, 4);
solver.part2 = data => findMarker(data, 14);

function findMarker(data: string, length: number) {
    for (let i = 0; i < data.length - length; i++) {
        const marker = data.substring(i, i + length);
        if (new Set(marker.split('')).size === length) {
            return i + length;
        }
    }
    return -1;
}

solver.test('mjqjpqmgbljsphdztnvjfqwrcgsmlb', 7, 19);

solver.run();
