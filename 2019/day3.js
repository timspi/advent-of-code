const { W1, W2 } = require('./data/day3.js');

let field = {};

let wire1 = W1.split(',');
let wire2 = W2.split(',');

addWire(wire1, true);
let intersections = addWire(wire2);

// console.log(intersections);

let min = Math.min(...intersections.map(el => Math.abs(el.p[0]) + Math.abs(el.p[1])));
console.log('The minimum distance is ' + min);

let minSteps = Math.min(...intersections.map(el => el.d));
console.log('The minimum steps is ' + minSteps);

// printField();



function addWire(wire, no) {
    let point = [0, 0];
    let distance = 0;
    let intersections = [];
    wire.forEach(el => {
        let dir = el.substr(0, 1);
        let len = el.substr(1);
        for (let i = 0; i < len-0; i++) {
            point = getNext(point, dir);
            distance++;
            let pos = point.join();
            if (field[pos]) {
                if (field[pos].no != no) { // No intersetions with itself
                    field[pos].distance += distance;
                    field[pos].no = no;
                    intersections.push({ p: point.slice(), d: field[pos].distance });
                }
            } else field[pos] = { dir, distance, no };
        }
    });
    return intersections;
}

function getNext(point, dir) {
    switch (dir) {
        case 'R': return [ point[0] + 1, point[1] ];
        case 'L': return [ point[0] - 1, point[1] ];
        case 'U': return [ point[0], point[1] + 1 ];
        case 'D': return [ point[0], point[1] - 1 ];
    }
}

function printField() {
    // console.log(field)
    let vals = Object.keys(field).map(el => el.split(','));
    let xVals = vals.map(el => el[0]), yVals = vals.map(el => el[1]);
    for (let y = Math.max(...yVals); y >= Math.min(...yVals); y--) {
        let line = '';
        for (let x = Math.min(...xVals); x <= Math.max(...xVals); x++) {
            line += x === 0 && y === 0 ? 'O' : getChar(field[x + ',' + y]);
            // line += field.hasOwnProperty(x + ',' + y) ? '+' : ' ';
        }
        console.log(line);
    }
}

function getChar(val) {
    if (!val) return ' ';
    switch (val.dir) {
        case 'U':
        case 'D':
            return '|';

        case 'L':
        case 'R':
            return '-';

        default: return ' ';
    }
}