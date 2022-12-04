import { ROWS, Solver } from './solver';

const solver = new Solver(ROWS);

solver.part1 = rucksacks => {
    let sum = 0;
    for (let rucksack of rucksacks) {
        sum += findCommonItem(rucksack);
    }
    return sum;
}

function findCommonItem(rucksack: string): number {
    const compartmentA = rucksack.slice(0, rucksack.length / 2);
    const compartmentB = rucksack.slice(rucksack.length / 2);

    for (let a = 0; a < compartmentA.length; a++) {
        for (let b = 0; b < compartmentB.length; b++) {
            if (compartmentA[a] === compartmentB[b]) {
                return getPriority(compartmentA[a]);
            }
        }
    }

    return 0;
}

function getPriority(char: string) {
    const charCodeLowerCaseA = 'a'.charCodeAt(0);
    const charCodeUpperCaseA = 'A'.charCodeAt(0);
    if (char.charCodeAt(0) < charCodeLowerCaseA) {
        return char.charCodeAt(0) - charCodeUpperCaseA + 27;
    } else {
        return char.charCodeAt(0) - charCodeLowerCaseA + 1;
    }
}

solver.part2 = rucksacks => {
    let sum2 = 0;
    for (let i = 0; i < rucksacks.length; i += 3) {
        let elves = rucksacks.slice(i, i + 3);
        let lens = elves.map((el, i) => ({ i, len: el.length }));
        lens.sort((a, b) => a.len - b.len);

        // To speed up computation, use the shortest input with index 2 as this is iterated over all the time
        // and the longest for index 3 as this is only iterated when there is a match in 1 and 2.
        sum2 += findCommonItemIn3([
            elves[lens[1].i], // mid
            elves[lens[0].i], // shortest
            elves[lens[2].i], // longest
        ]);
    }
    return sum2;
}

function findCommonItemIn3(elves: string[]): number {
    for (let a = 0; a < elves[0].length; a++) {
        for (let b = 0; b < elves[1].length; b++) {
            if (elves[0][a] !== elves[1][b]) continue;

            for (let c = 0; c < elves[2].length; c++) {
                if (elves[0][a] === elves[2][c]) {
                    return getPriority(elves[0][a]);
                }
            }
        }
    }

    return 0;
}

solver.test(`vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`, 157, 70)

solver.run();
