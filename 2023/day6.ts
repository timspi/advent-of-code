import { matchNumbers } from "../util/split";
import { Solver } from "./solver";

const solver = new Solver();

solver.part1 = data => {
    const [times, distances] = data.split('\n').map(line => matchNumbers(line));
    const races = times.map((t, i) => ({ duration: t, record: distances[i] }));

    let product = 1;
    for (const race of races) {
        let wins = 0;
        for (let speed = 1; speed < race.duration; speed++) {
            const distance = speed * (race.duration - speed);
            if (distance > race.record) wins++;
        }
        if (wins) product *= wins;
    }
    return product;
};

solver.part2 = data => {
    const [time, distance] = data.split('\n');
    const duration = Number(time.split(':')[1].replace(/ /g, ''));
    const record = Number(distance.split(':')[1].replace(/ /g, ''));


    // Basic approach: test all options as in part1, takes 70 ms on my machine
    // let wins = 0;
    // for (let speed = 1; speed < duration; speed++) {
    //     const distance = speed * (duration - speed);
    //     if (distance > record) wins++;
    // }

    // Smarter approach: calculate intersection points of distance and record
    // Formula: distance = t*(duration - t) where t is the duration the button is held down
    // Calculate result by using formula for solutions of quadratic equation: t^2 - duration*t + record = 0
    const root = Math.sqrt(Math.pow(duration, 2) - 4 * record);
    const sol1 = (duration + root) / 2;
    const sol2 = (duration - root) / 2;
    const max = Math.max(sol1, sol2), min = Math.min(sol1, sol2);
    const wins = Math.floor(max) - Math.ceil(min) + 1; // add 1 to include first and last in the count

    return wins;
}

solver.test(`Time:      7  15   30
Distance:  9  40  200`, 288, 71503);

solver.run();
