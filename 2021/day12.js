const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8').split('\n');

const paths = {};
for (let path of data) {
    const [start, end] = path.split('-');

    if (!paths[start]) paths[start] = [];
    paths[start].push(end);

    if (!paths[end]) paths[end] = [];
    paths[end].push(start);
}

function find(double_used = true, cave = 'start', visited = []) {
    const directions = paths[cave];
    const out = [];
    for (let dir of directions) {
        if (dir == 'end') {
            out.push([...visited, cave, 'end']);
            continue;
        }
        if (dir == 'start') {
            continue;
        }
        if (/^[a-z]+$/.test(dir) && visited.includes(dir)) {
            if (!double_used) {
                out.push(...find(true, dir, [...visited, cave]));
            }
            continue;
        }

        out.push(...find(double_used, dir, [...visited, cave]));
    }
    return out;
}

console.log(find().length);
console.log(find(false).length);
