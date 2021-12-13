const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8').split('\n\n');

const field = data[0].split('\n').map(el => el.split(',').map(Number));
const instructions = data[1].split('\n').map(el => el.split(' ').pop().split('='));

let part1 = false;
for (let ins of instructions) {
    const isY = ins[0] == 'y' ? 1 : 0;
    const ind = Number(ins[1]);

    for (let i = 0; i < field.length; ) {
        const f = field[i];
        if (f[isY] > ind) {
            field.splice(i, 1);
            const newVal = 2 * ind - f[isY];
            const newPos = field.find(el => el[isY] == newVal && el[1 - isY] == f[ 1 - isY]);
            if (!newPos) {
                const newEntry = [];
                newEntry[isY] = newVal;
                newEntry[1 - isY] = f[1 - isY];
                field.push(newEntry);
            }
        } else {
            i++;
        }
    }

    if (!part1) {
        part1 = true;
        console.log(field.length);
    }
}


// Visualize field

const width = Math.max(...field.map(f => f[0])) + 1;
const height = Math.max(...field.map(f => f[1])) + 1;
const paper = Array(height).fill(0).map(_ => Array(width).fill(' '));

for (let f of field) {
    paper[f[1]][f[0]] = '#';
}

console.log(paper.map(line => line.join('')).join('\n'));
