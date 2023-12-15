import { CSV, Solver } from "./solver";
import { arr } from "../util/array";

const solver = new Solver(CSV);

solver.part1 = data => data.reduce((acc, step) => acc + hash(step), 0);

solver.part2 = data => {
    const boxes = arr<{ label: string, focalLength: number }[]>(256, () => []);

    for (const step of data) {
        if (step.includes('=')) {
            const [label, focalLength] = step.split('=');
            const box = hash(label);
            const ind = boxes[box].findIndex(el => el.label === label);
            const lens = { label, focalLength: Number(focalLength) };
            if (ind >= 0) boxes[box].splice(ind, 1, lens);
            else boxes[box].push(lens);
        } else {
            const [label] = step.split('-');
            const box = hash(label);
            const ind = boxes[box].findIndex(el => el.label === label);
            if (ind >= 0) boxes[box].splice(ind, 1);
        }
    }
    return boxes.map((b, i) => b.reduce((acc, lens, li) => acc + (1 + i) * (1 + li) * lens.focalLength, 0)).reduce((a, b) => a + b);
};

function hash(str: string) {
    let value = 0;
    for (const char of str) {
        value += char.codePointAt(0) || 0;
        value = (value * 17) % 256;
    }
    return value;
}

solver.test(`HASH`, 52);
solver.test(`rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`, 1320, 145);

solver.run();
