import { Solver } from "./solver";

const solver = new Solver(data => {
    let [stackData, movementData] = data.split('\n\n').map(block => block.split('\n'));

    const indices: string[] = stackData.pop()?.trim().split('   ') || [];
    const stacks: { [key: string]: string[] } = {};
    stackData.reverse();
    for (let i = 0; i < indices.length; i++) {
        stacks[indices[i]] = stackData.map(line => line[1 + 4 * Number(i)]).filter(el => el != ' ');
    }

    const movements = movementData.map(m => {
        const [_, count, from, to] = m.match(/move (\d+) from (\d+) to (\d+)/) as [string, string, string, string];
        return { count, from, to };
    });
    return { movements, stacks }
});

solver.part1 = ({ movements, stacks: originalStacks }) => {
    const stacks = { ...originalStacks };
    // deep copy to retain original for part2
    for (let key in stacks) {
        stacks[key] = stacks[key].slice();
    }
    for (let move of movements) {
        for (let i = 0; i < Number(move.count); i++) {
            const item = stacks[move.from].pop() || '';
            stacks[move.to].push(item);
        }
    }
    return Object.values(stacks).map(stack => stack[stack.length - 1]).join('');
}

solver.part2 = ({ movements, stacks }) => {
    for (let move of movements) {
        const items = stacks[move.from].splice(stacks[move.from].length - Number(move.count)) || [];
        stacks[move.to].push(...items);
    }
    return Object.values(stacks).map(stack => stack[stack.length - 1]).join('');
}

solver.test(`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`, 'CMZ', 'MCD');

solver.run();
