import { matchNumbers } from "../util/split";
import { Solver } from "./solver";

const solver = new Solver(data => data.split('\n').map(matchNumbers));

function extrapolate(hist: number[], forwards: boolean) {
    const elements: number[] = [];
    while (hist.some(num => num !== 0)) {
        elements.push(hist[forwards ? hist.length - 1 : 0]);
        let next: number[] = [];
        for (let i = 0; i < hist.length - 1; i++) {
            next.push(hist[i + 1] - hist[i]);
        }
        hist = next;
    }
    Solver.log(elements);
    let extrapolated = 0;
    for (let i = elements.length - 1; i >= 0; i--) {
        extrapolated = elements[i] + (forwards ? extrapolated : -extrapolated);
    }
    return extrapolated;
}

solver.part1 = data => data.reduce((acc, history) => acc + extrapolate(history, true), 0);

solver.part2 = data => data.reduce((acc, history) => acc + extrapolate(history, false), 0);

solver.test(`0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`, 114, 2);

solver.run();
