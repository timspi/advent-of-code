const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8').split('\n');

const lines = data.map(el => el.split(' -> ').map(coord => {
    const [x, y] = coord.split(',').map(Number);
    return {x, y};
}));

function run(ignoreDiagonals) {
    const field = {};
    for (let line of lines) {
        const dx = line[1].x - line[0].x;
        const dy = line[1].y - line[0].y;
        if (ignoreDiagonals && dx != 0 && dy != 0) continue;
    
        let length = Math.max(Math.abs(dx), Math.abs(dy));
    
        let x = line[0].x, y = line[0].y;
        while (length-- >= 0) {
            const index = `${x},${y}`;
            
            if (field[index]) field[index]++;
            else field[index] = 1;
            
            if (dx != 0) x += Math.sign(dx);
            if (dy != 0) y += Math.sign(dy);
        }
    }
    return Object.values(field).filter(val => val > 1).length;
}

console.log(run(true));
console.log(run(false));
