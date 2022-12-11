let data = require('./data/day6.js');
// let data = `COM)B
// B)C
// C)D
// D)E
// E)F
// B)G
// G)H
// D)I
// E)J
// J)K
// K)L`;

data = data.split('\n');

let all = new Set();
let objects = {};
// data.forEach(el => {
//     let [planet, center] = el.split(')');

//     all.add(planet, center);
//     if (!objects[center]) {
//         objects[center] = [];
//     }
//     objects[center].push(planet);
// });

data.forEach(el => {
    let [center, planet] = el.split(')');
    all.add(planet, center);
    objects[planet] = center;
});


// console.log(all, objects);

let childs = {};
let count = 0;
all.forEach(obj => {
    let orig = obj;
    childs[orig] = [];
    while (obj != 'COM') {
        obj = objects[obj];
        childs[orig].push(obj);
        count++;
    }
})

let from = 'YOU'; // 'K';
let to = 'SAN'; // 'I';

console.log(count);

for (let obj of childs[from]) {
    if (childs[to].includes(obj)) {
        let route = [
            ...childs[from].slice(0, childs[from].indexOf(obj)),
            // obj, not needed as both are childs of this
            ...childs[to].slice(0, childs[to].indexOf(obj))
        ];
        console.log(route, route.length);
        break;
    }
}

// console.log(getOrbiters('COM'));

function getOrbiters(key) {
    console.log('*getOrbs' + key);
    let orbs = objects[key];
    if (typeof orbs === 'object') {
        return [].concat(...orbs.map(orb => getOrbiters(orb)));
    } else {
        return key;
    }
}