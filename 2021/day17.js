const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8');

const [_, x_str, y_str] = data.split(/,* [xy]=/g);
const target = {
    xmin: Number(x_str.split('..')[0]),
    xmax: Number(x_str.split('..')[1]),
    ymin: Number(y_str.split('..')[0]),
    ymax: Number(y_str.split('..')[1]),
};


/**
 * Simulate a throw with starting velocities dx and dy and return maximum
 * height reached if the target eas hit or undefined if it was missed.
 */
function run(dx, dy) {
    let x = 0, y = 0;
    let maximum = 0;
    while (x <= target.xmax && (dx > 0 || (x >= target.xmin && x <= target.xmax && y >= target.ymin))) {
        x += dx;
        y += dy;

        if (y > maximum) {
            maximum = y;
        }

        if (x >= target.xmin && x <= target.xmax && y >= target.ymin && y <= target.ymax) {
            return maximum;
        }

        dx = Math.max(0, dx - 1);
        dy--;
    }
    return undefined; // target not reached
}


let best;
let counter = 0;
for (let dx = 1; dx <= target.xmax; dx++) {
    for (let dy = target.ymin; dy < 200; dy++) { // FIXME replace constant with smart value calculated from bounds
        const res = run(dx, dy);
        if (res != undefined) {
            counter++;
            if (!best || res > best.score) best = { dx, dy, score: res };
        }
    }
}
console.log(best.score);
console.log(counter);
