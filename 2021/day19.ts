import { readFileSync } from 'fs';
import { basename } from 'path';

type Vec3 = [number, number, number];

const data = readFileSync('data/' + basename(__filename, '.ts'), 'utf-8').split('\n\n');
const scanners: Vec3[][] = data.map(block => block.split('\n').slice(1).map(line => line.split(',').map(el => Number(el)) as Vec3));

// use scanner 0 as base
const [base] = scanners.splice(0, 1);
const scannerLocations: Vec3[] = [[0, 0, 0]];

let scannerIndex = 0;
while (scanners.length > 0) {

    const result = findRotationAndOffsetOfScanner(scanners[scannerIndex]);
    if (result) {
        scanners.splice(scannerIndex, 1);

        for (let beacon of result) {
            if (!findBeaconInScanner(base, beacon)) {
                base.push(beacon);
            }
        }

        const progress = (data.length - 1 - scanners.length) / (data.length - 1) * 100;
        console.log(Math.round(progress) + '%');
    } else {
        scannerIndex++;
    }

    if (scannerIndex > scanners.length - 1) scannerIndex = 0;
}
console.log(base.length); // part1

let maxDistance = 0;
for (let i = 0; i < scannerLocations.length; i++) {
    for (let j = 0; j < scannerLocations.length; j++) {
        if (i === j) continue;
        const distance = scannerLocations[i].map((coord, coordIndex) => Math.abs(coord - scannerLocations[j][coordIndex])).reduce((a, b) => a + b);
        if (distance > maxDistance) maxDistance = distance;
    }
}
console.log(maxDistance); // part2


function findRotationAndOffsetOfScanner(originalScanner: Vec3[]) {
    for (let scanner of getRotations(originalScanner)) {
        for (let beacon of scanner) {
            for (let baseBeacon of base) {
                // Assume baseBeacon is the same as beacon and test if at least 12 beacons match

                const scannerOffset = subtract(baseBeacon, beacon);
                const offsettedScanner = scanner.map(b => add(scannerOffset, b));
                if (checkOverlappingBeaconsInScanners(base, offsettedScanner)) {
                    scannerLocations.push(scannerOffset);
                    return offsettedScanner;
                }
            }
        }
    }
    return false;
}

function checkOverlappingBeaconsInScanners(scanner1: Vec3[], scanner2: Vec3[]) {
    let counter = 0;
    for (let i = 0; i < scanner1.length; i++) {
        if (findBeaconInScanner(scanner2, scanner1[i])) {
            counter++;
            if (counter === 12) return true;
        }
        // If there are not enough beacons left to reach 12, we can leave early
        if (scanner1.length - i + counter <= 12) return false;
    }
    return false;
}

function findBeaconInScanner(scanner: Vec3[], beacon: Vec3) {
    for (let relBeacon of scanner) {
        if (isEqual(relBeacon, beacon)) return true;
    }
    return false;
}


function add(b1: Vec3, b2: Vec3) {
    return b1.map((coord, i) => coord + b2[i]) as Vec3;
}

function subtract(b1: Vec3, b2: Vec3) {
    return b1.map((coord, i) => coord - b2[i]) as Vec3;
}

function isEqual(b1: Vec3, b2: Vec3) {
    return b1.every((coord, i) => coord === b2[i]);
}


function getRotations(scanner: Vec3[]) {
    const rotations: Vec3[][] = [];

    const faces = [
        (pt: Vec3) => pt, // top
        (pt: Vec3) => rotX(pt, 180), // bottom
        (pt: Vec3) => rotX(pt, 90), // left
        (pt: Vec3) => rotX(pt, 270), // right
        (pt: Vec3) => rotY(pt, 90), // front
        (pt: Vec3) => rotY(pt, 270) // back
    ];
    const angles: (0 | 90 | 180 | 270)[] = [0, 90, 180, 270];
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
    function rotX(b: Vec3, angle: 0 | 90 | 180 | 270): Vec3 {
        return [
            b[0],
            cos[angle] * b[1] - sin[angle] * b[2],
            sin[angle] * b[1] + cos[angle] * b[2]
        ]
    }
    function rotY(b: Vec3, angle: 0 | 90 | 180 | 270): Vec3 {
        return [
            cos[angle] * b[0] + sin[angle] * b[2],
            b[1],
            -sin[angle] * b[0] + cos[angle] * b[2]
        ]
    }
    function rotZ(b: Vec3, angle: 0 | 90 | 180 | 270): Vec3 {
        return [
            cos[angle] * b[0] - sin[angle] * b[1],
            sin[angle] * b[0] + cos[angle] * b[1],
            b[2]
        ]
    }

    for (let f of faces)
        for (let angle of angles)
            rotations.push(scanner.map(beacon => rotZ(f(beacon), angle)));

    return rotations;
}
