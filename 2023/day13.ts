import { BLOCKS, Solver } from "./solver";

const solver = new Solver(data => BLOCKS(data).map(block => {
    const horizontalLines = block.split('\n');
    const verticalLines = Array(horizontalLines[0].length).fill(0).map((_, ind) => horizontalLines.map(line => line[ind]).join(''));
    return { horizontalLines, verticalLines };
}));

solver.part1 = data => evaluate(data, checkReflection);
solver.part2 = data => evaluate(data, checkReflectionWithSmudge);

function evaluate(data: { horizontalLines: string[], verticalLines: string[] }[], check: (lines: string[]) => false | number) {
    let sum = 0;
    for (const { horizontalLines, verticalLines } of data) {
        const matchH = check(horizontalLines);
        const matchV = check(verticalLines);
        Solver.log(matchH, matchV);
        if (matchH) sum += matchH * 100;
        if (matchV) sum += matchV;
    }
    return sum;
}

function checkReflection(lines: string[]) {
    findMatch: for (let i = 0; i < lines.length - 1; i++) {
        if (lines[i] === lines[i + 1]) {
            // Check if other lines are matching
            let j = i - 1, k = i + 2;
            while (j >= 0 && k < lines.length) {
                Solver.log(lines[j], lines[k]);
                if (lines[j] !== lines[k]) continue findMatch;
                j--; k++;
            }
            return i + 1;
        }
    }
    return false;
}

function checkReflectionWithSmudge(lines: string[]) {
    findMatch: for (let i = 0; i < lines.length - 1; i++) {
        let smudgeCounter = cmp(lines[i], lines[i + 1]);
        if (smudgeCounter <= 1) {
            // Check if other lines are matching
            let j = i - 1, k = i + 2;
            while (j >= 0 && k < lines.length) {
                Solver.log(lines[j], lines[k]);
                if (smudgeCounter === 1) {
                    if (lines[j] !== lines[k]) continue findMatch;
                } else {
                    smudgeCounter += cmp(lines[j], lines[k]);
                    if (smudgeCounter > 1) continue findMatch;
                }
                j--; k++;
            }
            if (smudgeCounter === 1) return i + 1;
        }
    }
    return false;
}

function cmp(l1: string, l2: string) {
    let differences = 0;
    for (let i = 0; i < l1.length; i++) {
        if (l1[i] !== l2[i]) differences++;
    }
    return differences;
}

solver.test(`#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`, 405, 400);

solver.run();
