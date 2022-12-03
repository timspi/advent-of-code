const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8').split('\n\n');

const scanners =data.map(el => el.split('\n').slice(1).map(line => line.split(',').map(Number)));

function generateRotations(scanner) {
    const rotations = [];

    const faces = {
        top: pt => pt,
        bottom: pt => rotX(pt, 180),
        left: pt => rotX(pt, 90),
        right: pt => rotX(pt, 270),
        front: pt => rotY(pt, 90),
        back: pt => rotY(pt, 270)
    };
    for (let f in faces)
        for (let angle of [0, 90, 180, 270])
            rotations.push({ f, angle, beacons: scanner.map(beacon => rotZ(faces[f](beacon), angle)) });
                
            // for (let rot of [ [0,1,2] , [1,0,2], [0,2,1], ])
     
    return rotations;
}
const sin = {
    0: 0,
    90: 1,
    180: 0,
    270: -1
};
const cos = {
    0: 1,
    90: 0,
    180: -1,
    270: 0
};
function rotX(pt, angle) {
    return [
        pt[0],
        cos[angle] * pt[1] - sin[angle] * pt[2],
        sin[angle] * pt[1] + cos[angle] * pt[2]
    ]
}
function rotY(pt, angle) {
    return [
        cos[angle] * pt[0] + sin[angle] * pt[2],
        pt[1],
        -sin[angle] * pt[0] + cos[angle] * pt[2]
    ]
}
function rotZ(pt, angle) {
    return [
        cos[angle] * pt[0] - sin[angle] * pt[1],
        sin[angle] * pt[0] + cos[angle] * pt[1],
        pt[2]
    ]
}
// console.log(scanners);
// console.log(generateRotations(scanners[1]).length);
// const test_rotations = generateRotations([ [1,2,3] ]).map(el => el.beacons[0].join());
// console.log(test_rotations);
// console.log([...new Set(test_rotations)]);


for (let i = 0; i < scanners.length; i++) {
    for (let j = 0; j < scanners.length; j++) {
    
        if (i == j) continue;
        
        for (let rotation of generateRotations(scanners[j])) {
            const offset = match(scanners[i], rotation.beacons);
            if (offset) {
                const { d, f, angle } = rotation;
                console.log(`matching scanner #${i} with #${j}, ${f}, rot=${angle}°, found:`, offset);
                // break;
            }
        }
    }
}

function match(ref, comp) {
    for (let i = 0; i < ref.length; i++) {
        // Offset of one beacon
        const offset = ref[i].map((x,d) => comp[0][d] - x);
        // console.log(offset);
        
        // Match all beacons with this offset
        let count = 0;
        for (let refBeacon of ref) {
            for (let scannerBeacon of comp) {
                if (refBeacon.map((x,d) => scannerBeacon[d] - x - offset[d]).reduce((a,b) => a + b) == 0) count++;
            }
        }
        // const count = ref.filter((line, l) => line.map((x,d) => scanner[l][d] - x - offset[d]).reduce((a,b) => a + b) == 0).length;
        if (count >= 12) {
            // console.log('i=' + i, count);
            return offset;
        }
    }
}