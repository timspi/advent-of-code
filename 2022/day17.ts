import { Solver } from "./solver";
import { drawMap, Map } from "./util/map";

const FINGERPRINT_SIZE = 20;

const solver = new Solver(data => data.split(''));

const rocks = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`.split('\n\n').map(block => {
    const lines = block.split('\n').map(l => l.split(''));
    const shape: Map = {};
    for (const [y, line] of lines.entries()) {
        for (const [x, symbol] of line.entries()) {
            if (symbol === '#') shape[[x, lines.length - y - 1].join()] = '#';
        }
    }
    return { height: lines.length, width: lines[0].length, shape };
});


solver.part1 = data => simulate(data, 2022);

solver.part2 = data => simulate(data, 1000000000000);


const cache: { [key: string]: { counter: number, pileTop: number } } = {};

function simulate(jets: string[], rounds: number) {
    let map: Map = {};
    let x = 0, y = 0;
    let pileTop = 0;

    let rockIndex = 0;
    let jetIndex = 0;

    let counter = 0;
    while (counter < rounds) {
        // new rock
        x = 2, y = pileTop + 3;
        // console.log('rock starts falling at ' + [x, y].join());

        while (true) {
            // first, move according to jet
            const dx = jets[jetIndex] === '<' ? -1 : 1
            if (checkBounds(x + dx) && checkMove(x + dx, y)) {
                // console.log('rock pushed to the ' + (dx === 1 ? 'right' : 'left'));
                x += dx;
            } else {
                // console.log('rock blocked by ' + (dx === 1 ? 'right' : 'left') + ' wall');
            }
            jetIndex++;
            if (jetIndex >= jets.length) jetIndex = 0;

            // then, move down
            if (y > 0 && checkMove(x, y - 1)) {
                y--;
            } else {
                // rock landed
                const top = y + rocks[rockIndex].height;
                if (top > pileTop) pileTop = top;
                // console.log('rock landed at ' + [x, y].join());
                Object.keys(rocks[rockIndex].shape).forEach(coord => map[add(coord, x, y)] = '#');
                break;
            }
        }

        // use caching
        if (counter > 2022) {
            const fingerprint = getFingerprint();
            if (cache[fingerprint] && (counter + counter - cache[fingerprint].counter) < rounds) {
                const cached = cache[fingerprint];
                Solver.log('cache match', fingerprint.padStart(FINGERPRINT_SIZE * 7 + 5, ' '), cached.counter, counter, cached.pileTop, pileTop);

                // update map
                const delta = pileTop - cached.pileTop;
                const updatedMap: Map = {};
                for (let line = pileTop - 1; line >= pileTop - FINGERPRINT_SIZE; line--) {
                    for (let col = 0; col < 7; col++) {
                        if (map[[col, line].join()]) {
                            updatedMap[[col, Number(line) + delta].join()] = '#';
                        }
                    }
                }

                counter += counter - cached.counter;
                pileTop += delta;
                map = updatedMap;
            }
            cache[fingerprint] = { counter, pileTop };
        }

        rockIndex++;
        if (rockIndex >= rocks.length) rockIndex = 0;

        counter++;
        if (counter === 10) Solver.log(drawMap(map, 1, 1, true) + '\n\n');
    }

    function getFingerprint() {
        let fingerprint = `${rockIndex};${jetIndex};`;
        for (let line = pileTop - 1; line >= pileTop - FINGERPRINT_SIZE; line--) {
            for (let col = 0; col < 7; col++) {
                fingerprint += map[[col, line].join()] || ' ';
            }
        }
        return fingerprint;
    }

    function checkBounds(x: number) {
        if (x < 0) return false;
        if (x + rocks[rockIndex].width > 7) return false;

        return true;
    }

    function checkMove(x: number, y: number) {
        for (const coord of Object.keys(rocks[rockIndex].shape)) {
            if (map[add(coord, x, y)]) return false;
        }
        return true;
    }

    function add(coord: string, dx: number, dy: number) {
        const [x, y] = coord.split(',');
        return [Number(x) + dx, Number(y) + dy].join();
    }

    return pileTop;
}

solver.test(`>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`, 3068, 1514285714288);

solver.run();
