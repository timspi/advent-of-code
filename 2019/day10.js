let data = `.###..#######..####..##...#
########.#.###...###.#....#
###..#...#######...#..####.
.##.#.....#....##.#.#.....#
###.#######.###..##......#.
#..###..###.##.#.#####....#
#.##..###....#####...##.##.
####.##..#...#####.#..###.#
#..#....####.####.###.#.###
#..#..#....###...#####..#..
##...####.######....#.####.
####.##...###.####..##....#
#.#..#.###.#.##.####..#...#
..##..##....#.#..##..#.#..#
##.##.#..######.#..#..####.
#.....#####.##........#####
###.#.#######..#.#.##..#..#
###...#..#.#..##.##..#####.
.##.#..#...#####.###.##.##.
...#.#.######.#####.#.####.
#..##..###...###.#.#..#.#.#
.#..#.#......#.###...###..#
#.##.#.#..#.#......#..#..##
.##.##.##.#...##.##.##.#..#
#.###.#.#...##..#####.###.#
#.####.#..#.#.##.######.#..
.#.#####.##...#...#.##...#.`;
// let data = `.#..##.###...#######
// ##.############..##.
// .#.######.########.#
// .###.#######.####.#.
// #####.##.#.##.###.##
// ..#####..#.#########
// ####################
// #.####....###.#.#.##
// ##.#################
// #####.##.###..####..
// ..######..##.#######
// ####.##.####...##..#
// .#####..#.######.###
// ##...#.##########...
// #.##########.#######
// .####.#.###.###.#.##
// ....##.##.###..#####
// .#.#.###########.###
// #.#.#.#####.####.###
// ###.##.####.##.#..##`;

data = data.split('\n').map(el => el.split('').map(val => val === '#' ? true : false));

// console.log(data);

let asteriods = {};
for (let y = 0; y < data.length; y++) {
    let row = data[y];
    for (let x = 0; x < row.length; x++) {
        if (row[x]) {
            asteriods[x + ',' + y] = true;
        }
    }
}


let laser = findBest();
calc200th(laser);


function calc200th(laser) {
    // let laser = [17, 23];
    let objs = Object.keys(asteriods).filter(el => el !== laser.join()).map((foo, index) => {
        let pos = foo.split(',').map(el => el - 0);
        return {
            id: index,
            pos,
            angle: getSortVal(sub(pos, laser)),
            distance : getDistance(pos, laser)

        };
    });
    let angles = [...new Set(objs.map(el => el.angle))].sort((a, b) => a - b);
    
    // console.log(objs, angles);
    let index = 0, delCount = 0;
    while (objs.length > 0) {
        let angle = angles[index];
        let o = objs.filter(el => el.angle === angle);
        if (o.length > 0) {
            o.sort((a, b) => a.distance - b.distance);
            let delInd = objs.findIndex(el => el.id === o[0].id);
            let del = objs.splice(delInd, 1)[0];
            delCount++;
            // console.log(delCount, del);
            if (delCount === 200) console.log('200th vaporized asteriod is ' + (del.pos[0] * 100 + del.pos[1]));
        }
        index++;
        if (index >= angles.length) idnex = 0;
    }
}

// function calc200th(laser) {
//     // let laser = [17, 23];
//     let objs = Object.keys(asteriods).filter(el => el !== laser.join()).map(foo => foo.split(',').map(el => el - 0));
//     objs.sort((a, b) => getSortVal(sub(a, laser)) - getSortVal(sub(b, laser)));

//     console.log(objs);
    
//     let index = 0, delCount = 0, deleted = ['foo'];
//     while (objs.length > 0) {
//         let obj = objs[index];
//         if (checkLine2(objs, obj, laser)) {
//             // Remove object
//             delCount++;
//             let del = objs.splice(0, 1)[0];
//             deleted.push(del);
//             // console.log('#' + delCount + ': ' + deleted.join());
//         } else {
//             index++;
//         }
//         if (index >= objs.length) index = 0;
//     }
//     console.log(deleted);
// }


function sub(a, b) {
    return [ a[0] - b[0] , b[1] - a[1] ]; // weird coordinate system, didn't bother to rework
}

function getSortVal(coord) {
    let val = Math.PI / 2 - Math.atan2(coord[1], coord[0]);
    if (val < 0) return val + 2 * Math.PI;
    return val;
}

function getDistance(a, b) {
    return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2);
}



function findBest() {
    Object.keys(asteriods).forEach(key => {
        asteriods[key] = 0;
        for (let a of Object.keys(asteriods)) {
            if (a === key) continue;
            
            if (checkLine(key, a)) asteriods[key]++;
        }
    });

    let keys = Object.keys(asteriods)
    let vals = Object.values(asteriods)
    let max = Math.max(...vals);
    let i = vals.findIndex(el => el === max);
    console.log('Maximum ' + max + ' at ' + keys[i]);

    return keys[i].split(',').map(el => el - 0);
}


// console.log(checkLine('3,2', '1,0'));
// console.log(checkLine('1,0', '3,4'));
// console.log(checkLine('1,0', '4,4'));

function checkLine(a, b) {
    if (typeof a === 'string') a = a.split(',').map(el => el - 0);
    if (typeof b === 'string') b = b.split(',').map(el => el - 0);
    let w = b[0] - a[0];
    let h = b[1] - a[1];
    let d = gcd(w, h);
    let dx = w / d, dy = h / d;
    for (let i = 1; i < d; i++) {
        let x = a[0] + dx * i;
        let y = a[1] + dy * i;
        if (asteriods.hasOwnProperty(x + ',' + y)) return false;
    }
    return true;
}

function checkLine2(objects, a, b) {
    let w = b[0] - a[0];
    let h = b[1] - a[1];
    let d = gcd(w, h);
    let dx = w / d, dy = h / d;
    for (let i = 1; i < d; i++) {
        let x = a[0] + dx * i;
        let y = a[1] + dy * i;
        if (objects.findIndex(el => el[0] == x && el[1] == y) >= 0) return false;
    }
    return true;
}


function get(x, y) {
    return data[y][x];
}

function gcd(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);

    while (y) {
      let t = y;
      y = x % y;
      x = t;
    }

    return x;
}
