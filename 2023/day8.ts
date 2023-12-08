import { lcm } from "../util/math";
import { matchPattern } from "../util/split";
import { Solver } from "./solver";

const solver = new Solver(data => {
    const [directions, network] = data.split('\n\n');
    const nodes: { [key: string]: { L: string, R: string } } = {};
    network.split('\n').forEach(line => {
        const [node, left, right] = matchPattern(line, /(\w+) = \((\w+), (\w+)\)/);
        nodes[node] = { L: left, R: right };
    });
    return { directions, nodes };
});

solver.part1 = ({ directions, nodes }) => {
    let node = 'AAA';
    let counter = 0;
    while (node !== 'ZZZ') {
        const dir = directions[counter % directions.length] as 'L' | 'R';
        node = nodes[node][dir];
        counter++;
    }
    return counter;
};

solver.part2 = ({ directions, nodes }) => {
    const nodeStrs = Object.keys(nodes);
    let startNodes = nodeStrs.filter(n => n.endsWith('A'));

    // Find number of steps for each start node to end on Z
    const steps: Record<string, number> = {};
    for (const startNode of startNodes) {
        let node = startNode;
        let counter = 0;
        while (!node.endsWith('Z')) {
            const dir = directions[counter % directions.length] as 'L' | 'R';
            node = nodes[node][dir];
            counter++;
        }
        steps[startNode] = counter;
    }
    Solver.log(steps);

    // Find least common multiple: there, all nodes end on Z for the first time
    return lcm(...Object.values(steps));
};

solver.test(`RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`, 2);

solver.test(`LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`, 6);

solver.test(`LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`, false, 6);

solver.run();
