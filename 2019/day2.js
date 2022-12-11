const DATA = require('./data/day2.js');
const Computer = require('./intcode.js');
const comp = new Computer();

console.log('Part 1: program(12, 2) = ' + runProgram(DATA.slice(), 12, 2));
console.log('Part 2: program(i, j) == 19690720 -> 100 * i + j = ' + findValues(DATA));
// programToText(program);

function findValues(program) {
    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
            let prg = program.slice();
            let res = runProgram(prg, i, j);
            if (res == 19690720) return 100 * i + j;
        }
    }
}

function runProgram(data, noun, verb) {
    data[1] = noun;
    data[2] = verb;
    return comp.run(data)[0];
}

/* PART 2 */

function programToText(program) {
    let text = [];
    let pointer = 0;
    let results = {};
    while (program[pointer] !== 99) {
        let line = '';
        let opcode = program[pointer];
        switch (opcode) {
            case 1: line += 'ADD '; break;
            case 2: line += 'MUL '; break;
        }
        line += program[program[pointer + 1]];
        line += ' ';
        line += program[program[pointer + 2]];

        text.push(line);
        pointer += 4;
    }

    console.log(text.join('\n'));
}