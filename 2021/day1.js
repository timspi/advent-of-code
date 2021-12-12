const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8').split('\n').map(Number);

console.log(data.map((el,i,arr) => el > arr[i - 1]).reduce((a, b) => a + b, 0));
console.log(data.map((el, i, arr) => el + arr[i + 1] + arr[i + 2]).map((el,i,arr) => el > arr[i - 1]).reduce((a, b) => a + b, 0));
