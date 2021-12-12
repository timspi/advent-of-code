let start = 307237;
let end = 769058;

let parts = start.toString().split('');

let count = 0;
let possibles = [];
for (let num = start; num <= end; num++) {
    if (checkNum(num)) {
        count++;
        possibles.push(num);
    }
}
console.log(count);

let possibles2 = possibles.filter(check2);
console.log(possibles2.length);

function checkNum(num) {
    let parts = num.toString().split('');

    // Two adjacent digits have to be the same
    if (parts.filter((val, i, arr) => val === arr[i + 1]).length === 0) return false;

    // Going from left to right, the digits cannot decrease
    if (parts.filter((val, i, arr) => val > arr[i + 1]).length > 0) return false;

    return true;
}

function check2(num) {
    let str = num.toString();
    for (let test = 9; test >= 1; test--) {
        if (str.includes('' + test + test) && !str.includes('' + test + test + test)) {
            return true;
        }
    }
    return false;
}