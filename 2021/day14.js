const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8').split('\n\n');

const polymer = data[0];
const rules = Object.fromEntries(data[1].split('\n').map(el => el.split(' -> ')));


function getCounts(polymer) {
    const counts = {};
    for (let c of polymer) {
        if (!counts[c]) counts[c] = 0;
        counts[c]++;
    }
    return counts;
}

function addCounts(...counts) {
    const out = {};
    const entries = [].concat(...counts.map(c => Object.entries(c)));
    for (let [key, val] of entries) {
        if (!out[key]) out[key] = 0;
        out[key] += val;
    }
    return out;
}

function applyRule(polymer) {
    const ins = rules[polymer];
    if (ins) {
        polymer = polymer.substr(0, 1) + ins + polymer.substr(1);
    }
    return polymer;
}


// Build a cache starting with the last level
const cache = {};
for (let round = 1; round <= 40; round++) {
    for (let rule in rules) {
        const next = applyRule(rule);
        if (round == 1) {
            cache[round + rule] = getCounts(next);
        } else {
            const results = [];
            for (let i = 0; i < 2; i++) {
                results.push(cache[(round - 1) + next.substr(i, 2)]);
            }
            cache[round + rule] = addCounts(...results);
            cache[round + rule][next[1]]--; // correction for double counted middle letter
        }
    }
}
// console.log(cache);

function getResults(round) {
    const results = [];
    for (let i = 0; i < polymer.length - 1; i++) {
        results.push(cache[round + polymer.substr(i, 2)]);
    }

    const counts = addCounts(...results);

    // Correct for double counted letters inside
    for (let i = 1; i < polymer.length - 1; i++) {
        counts[polymer[i]]--;
    }

    // console.log(counts);
    const max = Math.max(...Object.values(counts));
    const min = Math.min(...Object.values(counts));
    return max - min;
}

console.log(getResults(10));
console.log(getResults(40));
