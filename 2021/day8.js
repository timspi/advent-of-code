const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8').split('\n');

const lines = data.map(el => el.split(' | ')).map(el => ({ digits: el[0].split(' '), out: el[1].split(' ') }));

const part1 = lines.map(el => el.out.filter(str => [2, 3, 4, 7].includes(str.length)).length).reduce((a, b) => a + b);
console.log(part1);


// Mapping:
// 0: 'abcefg',    // X
// 1: 'cf',        // 2
// 2: 'acdeg',     // X
// 3: 'acdfg',     // X
// 4: 'bcdf',      // 4
// 5: 'abdfg',     // X
// 6: 'abdefg',    // X
// 7: 'acf',       // 3
// 8: 'abcdefg',   // 7
// 9: 'abcdfg'     // X

function decode(digits) {
    // get maps for digits with unique length
    const map1 = digits.find(str => str.length == 2);
    const map4 = digits.find(str => str.length == 4);
    const map7 = digits.find(str => str.length == 3);
    const map8 = digits.find(str => str.length == 7);

    const mapping = {};
    mapping['cf'] = map1;
    mapping['bcdf'] = map4;
    mapping['acf'] = map7;
    mapping['abcdefg'] = map8;
    mapping['a'] = remove(map7, map1);
    mapping['bd'] = remove(map4, map1);
    mapping['eg'] = remove(map8, map4 + mapping['a']);
    mapping['bdeg'] = remove(map8, map7);
    mapping['bcdefg'] = remove(map8, mapping['a']);
    mapping['cefg'] = map1 + mapping['eg'];
    mapping['aeg'] = mapping['a'] + mapping['eg'];
    mapping['acefg'] = mapping['aeg'] + map1;
    mapping['abcdf'] = mapping['a'] + map4;

    return mapping;
}

function parse(val, mapping) {
    if (check(val, mapping['cf'])) return 1;
    if (check(val, mapping['bcdf'])) return 4;
    if (check(val, mapping['acf'])) return 7;
    if (check(val, mapping['abcdefg'])) return 8;

    if (includes(val, mapping['acefg'])) return 0;
    if (includes(val, mapping['bdeg'])) return 6;
    if (includes(val, mapping['abcdf'])) return 9;
    if (includes(val, mapping['aeg'])) return 2;
    if (includes(val, mapping['cf'])) return 3;
    
    return 5;
}

function remove(str, chars) {
    return str.replace(new RegExp(`[${chars}]`, 'g'), '');
}

function check(str, chars) {
    return new RegExp(`^[${chars}]{${chars.length}}$`).test(str);
}

function includes(str, chars) {
    return chars.split('').every(c => str.includes(c));
}

let sum = 0;
for (let line of lines) {
    const mapping = decode(line.digits);
    const code = line.out.map(val => parse(val, mapping)).join('');
    // console.log(code);
    sum += Number(code);
}

console.log(sum);
