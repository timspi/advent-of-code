const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8').split(',');

const fishies = data.map(Number);

// Part1
for (let day = 0; day < 80; day++) {
    const newborn = [];
    for (let i = 0; i < fishies.length; i++) {
        fishies[i]--;
        if (fishies[i] < 0) {
            fishies[i] = 6;
            newborn.push(8);
        }
    }
    fishies.push(...newborn);
}

console.log(fishies.length);


// Part2: smarter solution that does not need a HUGE array
const fish_counts = Array(9).fill(0);
data.map(Number).forEach(fish => fish_counts[fish]++);

for (let day = 0; day < 256; day++) {
    const count = fish_counts.splice(0, 1)[0];
    fish_counts[6] += count;
    fish_counts[8] = count;
}

console.log(fish_counts.reduce((a, b) => a + b));
