const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8').split('\n');

const field = data.map(row => row.split('').map(Number));

function get(r, c) {
    if (r < 0 || c < 0) return Infinity;
    if (r >= field.length) return Infinity;
    if (c >= field[r].length) return Infinity;

    return field[r][c];
}


let sum = 0;

for (let r = 0; r < field.length; r++) {
    for (let c = 0; c < field[r].length; c++) {
        const height = get(r, c);
        if (
            height < get(r - 1, c) &&
            height < get(r + 1, c) &&
            height < get(r, c - 1) &&
            height < get(r, c + 1)
        ) {
            // console.log('LP at ' + r + ',' + c, height);
            sum += height + 1;
        }
    }
}

console.log(sum);


// Part2
const basins = {};

function walk(r, c) {
    const height = get(r, c);
    if (height == 9) return;

    const adj = [
        get(r - 1, c),
        get(r + 1, c),
        get(r, c - 1),
        get(r, c + 1)
    ];
    const min = Math.min(...adj);
    if (min > height) return [r, c].join();

    switch (adj.indexOf(min)) {
        case 0: return walk(r - 1, c);
        case 1: return walk(r + 1, c);
        case 2: return walk(r, c - 1);
        case 3: return walk(r, c + 1);
    }
    throw new Error();
}

for (let r = 0; r < field.length; r++) {
    for (let c = 0; c < field[r].length; c++) {
        const lp = walk(r, c);
        // console.log(lp);
        if (lp) {
            basins[lp] = (basins[lp] || 0) + 1;
        }
    }
}

// console.log(basins);
console.log(Object.values(basins).sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a * b, 1));
