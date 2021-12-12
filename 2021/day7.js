const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8').split(',').map(Number);

const min = Math.min(...data);
const max = Math.max(...data);

function run(use_crab_engines) {
    let min_fuel = Infinity;
    
    for (let pos = min; pos <= max; pos++) {
        const fuel = data.map(el => {
            if (use_crab_engines) {
                const n = Math.abs(pos - el);
                return n * (n + 1) / 2;
            } else {
                return Math.abs(pos - el);
            }
        }).reduce((a, b) => a + b);
        if (fuel < min_fuel) min_fuel = fuel;
    }

    return min_fuel;
}

console.log(run(false));
console.log(run(true));
