import { matchNumbers, matchPattern } from "../util/split";
import { ROWS, Solver } from "./solver";

const solver = new Solver(ROWS);

solver.part1 = data => {
    let sum = 0;
    for (const line of data) {
        const [not1, not2] = line.split(' ');
        const groups = matchNumbers(not2);
        sum += match(not1, groups);
    }
    return sum;
};

solver.part2 = data => {
    let sum = 0;
    let counter = 0;
    for (const line of data) {
        counter++;
        const [not1, not2] = line.split(' ');
        const groups = matchNumbers(Array(5).fill(not2).join(','));
        const text = Array(5).fill(not1).join('?');
        // Solver.log(text, groups);
        const res = match(text, groups);
        // Solver.log(res, '\n\n');
        sum += res;
        console.log(counter * 100 / data.length + ' %');
    }
    return sum;
};

let cache: { [hash: string]: number } = {};
function match(text: string, groups: number[]) {
    const hash = text + ' ' + groups.join();
    if (cache[hash]) {
        return cache[hash];
    }
    // Solver.log(text, groups);

    if (text.length === 0) {
        const success = groups.length === 0;
        // Solver.log(success ? 'success\n' : 'fail\n');
        return success ? 1 : 0;
    }

    if (groups.length === 0) {
        return text.includes('#') ? 0 : 1;
    }

    const minLen = groups.reduce((a, b) => a + b);
    if (text.length < minLen + groups.length - 1) return 0;

    let count = 0;
    if (text[0] !== '.') {
        // ? or # -> try to interpret as #, i.e. take group
        const group = groups[0];
        const chars = text.substring(0, group);
        if (chars.length === group && !chars.includes('.') && text.substring(group, group + 1) !== '#') {
            // Success, continue along
            count += match(text.substring(group + 1), groups.slice(1));
        }

    }

    if (text[0] !== '#') {
        // ? or . -> try to interpret as .
        count += match(text.substring(1), groups);
    }

    cache[hash] = count;
    return count;
}

solver.test(`..?.????#?????????? 1,1,1,1,1,4`, 26, -1);

solver.test(`???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`, 21, 525152);

solver.run();
