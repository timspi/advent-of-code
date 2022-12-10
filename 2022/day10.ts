import { Solver } from "./solver"

const solver = new Solver(data => {
    const lines = data.split('\n');
    const xValues: number[] = [];
    let X = 1;
    for (let line of lines) {
        const [instr, arg] = line.split(' ');
        if (instr === 'noop') {
            xValues.push(X);
        } else if (instr === 'addx') {
            xValues.push(X, X);
            X += Number(arg);
        }
    }
    return xValues;
});

solver.part1 = xValues => [20, 60, 100, 140, 180, 220].map(cycle => cycle * xValues[cycle - 1]).reduce((a, b) => a + b);

solver.part2 = xValues => {
    const out: string[] = [];
    for (let row = 0; row < 6; row++) {
        const line: string[] = [];
        for (let col = 0; col < 40; col++) {
            const x = xValues[40 * row + col];
            line.push((x >= col - 1 && x <= col + 1) ? '█' : ' ');
        }
        out.push(line.join(''))
    }
    return out.join('\n');
};

solver.test(`addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`, 13140, `██  ██  ██  ██  ██  ██  ██  ██  ██  ██  
███   ███   ███   ███   ███   ███   ███ 
████    ████    ████    ████    ████    
█████     █████     █████     █████     
██████      ██████      ██████      ████
███████       ███████       ███████     `);

solver.run();