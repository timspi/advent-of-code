const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8').split('\n');

// Part1
let ones = data[0].split('').fill(0);
for (let el of data) {
    const row = el.split('');
    ones = ones.map((count, i) => count + Number(row[i]));
}
const gamma = parseInt(ones.map(el => el > data.length / 2 ? '1' : '0').join(''), 2);
const epsilon = parseInt(ones.map(el => el > data.length / 2 ? '0' : '1').join(''), 2);
console.log(gamma * epsilon);

// Part2
const len = data[0].length;
function run(lines, oxygen_generator = true) {
    for (let i = 0; i < len; i++) {
        const one_count = lines.filter(l => l.substr(i, 1) == '1').length;
        const keep_prefix = (one_count >= lines.length / 2) ? (oxygen_generator ? '1' : '0') : (oxygen_generator ? '0' : '1');
        lines = lines.filter(l => l.substr(i, 1) == keep_prefix);
        if (lines.length <= 1) break;
    }
    return parseInt(lines[0], 2);
}
const og = run(data, true);
const cs = run(data, false);
console.log(og * cs);
