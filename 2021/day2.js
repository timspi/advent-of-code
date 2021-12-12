const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8').split('\n');

let depth = 0, x = 0;
for (let ins of data) {
    let [cmd, num] = ins.split(' ');
    num = Number(num);
    switch (cmd) {
        case 'forward': x += num; break;
        case 'down': depth += num; break;
        case 'up': depth -= num; break;
    }
}
console.log(depth * x);

let aim = 0;
depth = 0, x = 0;
for (let ins of data) {
    let [cmd, num] = ins.split(' ');
    num = Number(num);
    switch (cmd) {
        case 'forward':
            x += num;
            depth += aim * num;
            break;
        case 'down': aim += num; break;
        case 'up': aim -= num; break;
    }
}
console.log(depth * x);
