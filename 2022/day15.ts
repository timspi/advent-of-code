import { Solver } from "./solver";
import { drawMap, Map } from "./util/map";

const solver = new Solver(data => {
    let minX = Infinity, maxX = -Infinity;
    const sensors = data.split('\n').map(line => {
        const [sensorX, sensorY, beaconX, beaconY] = [...line.matchAll(/(-?\d+)/g)].map(match => Number(match[0]));

        const distance = getDistance(sensorX, sensorY, beaconX, beaconY);

        if (sensorX - distance < minX) minX = sensorX - distance;
        if (sensorX + distance > maxX) maxX = sensorX + distance;

        return { sensorX, sensorY, distance, beaconX, beaconY };
    });
    if (solver.isTesting) visualize(sensors);

    return { sensors, minX, maxX };
});

function getDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

const visualize = (data: { sensorX: number, sensorY: number, distance: number, beaconY: number, beaconX: number }[]) => {
    const map: Map = {};
    for (const s of data) {
        map[`${s.sensorX},${s.sensorY}`] = 'S';
        map[`${s.beaconX},${s.beaconY}`] = 'B';
        for (let dx = -s.distance; dx <= s.distance; dx++) {
            for (let dy = -s.distance; dy <= s.distance; dy++) {
                if (Math.abs(dx) + Math.abs(dy) <= s.distance && !map[`${s.sensorX + dx},${s.sensorY + dy}`]) map[`${s.sensorX + dx},${s.sensorY + dy}`] = '#';
            }
        }
    }
    Solver.log(drawMap(map, 5, 1));
}

solver.part1 = ({ sensors, maxX, minX }) => {
    const row = solver.isTesting ? 10 : 2000000;
    let count = 0;
    for (let x = minX; x <= maxX; x++) {
        if (checkPosition(x, row, sensors)) {
            if (!sensors.find(s => (s.sensorX === x && s.sensorY === row) || (s.beaconX === x && s.beaconY === row)))
                count++;
        }
    }
    return count;
}

solver.part2 = ({ sensors }) => {
    const searchMin = 0;
    const searchMax = solver.isTesting ? 20 : 4000000;

    // find pairs of sensors with exactly their distances + 2 apart
    const coords = new Set<string>();
    for (let i = 0; i < sensors.length; i++) {
        for (let j = i + 1; j < sensors.length; j++) {
            const a = sensors[i], b = sensors[j];
            const distance = getDistance(a.sensorX, a.sensorY, b.sensorX, b.sensorY);
            const diff = distance - (a.distance + b.distance);

            if (diff === 2) {
                // check all possible beacon locations inbetween pair
                const dirX = Math.sign(b.sensorX - a.sensorX);
                const dirY = Math.sign(b.sensorY - a.sensorY);

                // beacon is distance + 1 away from sensor
                for (let dx = 0; dx <= a.distance + 1; dx++) {
                    const bx = a.sensorX + dirX * dx;
                    const by = a.sensorY + dirY * (a.distance + 1 - dx);

                    if (getDistance(bx, by, b.sensorX, b.sensorY) - b.distance === 1) {
                        coords.add(`${bx},${by}`);
                    }
                }
            }
        }
    }

    // check all possible locations if they are valid for all sensors
    for (const coord of coords) {
        const [x, y] = coord.split(',').map(el => Number(el));
        if (x >= searchMin && x <= searchMax && y >= searchMin && y <= searchMax && !checkPosition(x, y, sensors)) {
            return x * 4000000 + y;
        }
    }

    return 0;
}

function checkPosition(x: number, y: number, sensors: { sensorX: number, sensorY: number, distance: number }[]) {
    for (let sensor of sensors) {
        if (getDistance(sensor.sensorX, sensor.sensorY, x, y) <= sensor.distance) {
            return true;
        }
    }
    return false;
}

solver.test(`Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`, 26, 56000011);

solver.run();
