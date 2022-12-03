const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8').split('\n');

const field = data.map(line => line.split('').map(Number));

const map = {};
for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[y].length; x++) {
        map[`${x},${y}`] = field[y][x];
    }
}

const offsets = [
    [0,-1],
    [0,1],
    [-1,0],
    [1,0]
];

function run(fieldMap, end) {
    const shortestPaths = {
        '0,0': 0
    };
    let counter = 1000;
    while (!shortestPaths[end] && counter--) {
        // Find next steps
        for (const pos in shortestPaths) {
            for (const offset of offsets) {
                const next = pos.split(',').map((p,i) => (p - 0) + offset[i]).join();
    
                const val = fieldMap[next];
                if (!val) continue;
    
                const score = shortestPaths[pos] + val;
                if (!shortestPaths[next] || score < shortestPaths[next]) {
                    shortestPaths[next] = score;
                }
            }
        }
    }
    console.log(shortestPaths[end]);
}
run(map, [ field.length - 1, field[0].length - 1 ].join());



// PART 2

const extendedMap = {...map};
for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
        if (x == 0 && y == 0) continue;
        for (const pos in map) {
            const newPos = pos.split(',').map((p, i) => (i ? field.length * x : field[0].length * y) + Number(p)).join();
            const val = (map[pos] + x + y - 1) % 9 + 1;
            extendedMap[newPos] = val;
        }
    }
}
// FIXME: This takes around 5 minutes on a powerful PC
run(extendedMap, [ 5 * field.length - 1, 5 * field[0].length - 1 ].join());
