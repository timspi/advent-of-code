const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8').split('\n');

const levels = data.map(line => line.split('').map(Number));

let flashes = 0;
let flashes_step;

const total = levels.length * levels[0].length;

for (let i = 0; i < 1000; i++) {
    flashes_step = 0;

    for (let r = 0; r < levels.length; r++) {
        for (let c = 0; c < levels[r].length; c++) {
            add(r, c);
        }
    }

    if (flashes_step == total) {
        // Part2:
        console.log(1 + i);
        return;
    }

    // Reset all squids that have flashed
    for (let r = 0; r < levels.length; r++) {
        for (let c = 0; c < levels[r].length; c++) {
            if (levels[r][c] > 9) {
                levels[r][c] = 0;
            }
        }
    }

    if (i == 99) {
        // Part1:
        console.log(flashes);
    }
}

function add(r, c, val = 1) {
    if (r < 0 || c < 0 || r > levels.length - 1 || c > levels[r].length - 1)
        return; // out of bounds

    levels[r][c] += val;

    if (levels[r][c] == 10) {
        flashes++;
        flashes_step++;

        // Increase all adjacent squids
        for (let dr = -1; dr <= 1; dr++) {
            add(r + dr, c - 1);
            add(r + dr, c );
            add(r + dr, c + 1);
        }
    }
}
