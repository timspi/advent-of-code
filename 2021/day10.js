const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8').split('\n');

function checkLine(line, part2 = false) {
    const stack = [];
    const mappings = {
        '(': ')',
        '[': ']',
        '{': '}',
        '<': '>'
    };
    const scores = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137
    };
    for (let c of line.split('')) {
        if (mappings[c]) {
            stack.push(c);
        } else {
            const openingSymbol = stack.pop();
            if (!part2 && c != mappings[openingSymbol])
                return scores[c];
        }
    }
    if (part2) {
        return stack.map(c => mappings[c]).reverse().reduce((a, b) => (a * 5) + ' )]}>'.indexOf(b), 0);
    }
    return 0;
}
console.log(data.map(el => checkLine(el)).reduce((a, b) => a + b));

var data2 = data.filter(line => checkLine(line) == 0);
var points = data2.map(c => checkLine(c, true));
points.sort((a, b) => a - b);
console.log(points[Math.floor(points.length / 2)]);
