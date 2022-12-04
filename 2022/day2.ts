import { ROWS, Solver } from './solver';

const solver = new Solver(ROWS);

const winScenarios = [
    'A Y',
    'B Z',
    'C X'
];
const drawScenarios = [
    'A X',
    'B Y',
    'C Z'
];

solver.part1 = rounds => {
    let score = 0;

    for (let round of rounds) {
        if (winScenarios.includes(round)) score += 6;
        else if (drawScenarios.includes(round)) score += 3;

        score += 1 + 'XYZ'.indexOf(round[2]);
    }

    return score;
}


const roundEndings = {
    'X': { // loose
        score: 0,
        moveScores: {
            'A': 3,
            'B': 1,
            'C': 2
        }
    },
    'Y': { // draw
        score: 3,
        moveScores: {
            'A': 1,
            'B': 2,
            'C': 3
        }
    },
    'Z': { // win
        score: 6,
        moveScores: {
            'A': 2,
            'B': 3,
            'C': 1
        }
    },
}

solver.part2 = rounds => {
    let score = 0;

    for (let round of rounds) {
        const [move, strategy] = round.split(' ');
        const ending = roundEndings[strategy as 'X' | 'Y' | 'Z']
        score += ending.score + ending.moveScores[move as 'A' | 'B' | 'C'];
    }

    return score;
}

solver.test(`A Y
B X
C Z`, 15, 12);

solver.run();
