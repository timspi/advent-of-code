import { matchNumbers, split } from "../util/split";
import { arr } from "../util/array";
import { ROWS, Solver } from "./solver";

const solver = new Solver(data => ROWS(data).map(line => {
    const [_, wins, mine] = split(line, ': ', ' | ');
    return { wins: matchNumbers(wins), mine: matchNumbers(mine) }
}));

solver.part1 = cards => {
    let score = 0;
    for (const card of cards) {
        let cardScore = 0;
        for (const my of card.mine) {
            if (card.wins.includes(my)) {
                if (cardScore === 0) cardScore = 1;
                else cardScore *= 2;
            }
        }
        score += cardScore;
        Solver.log(cardScore);
    }
    return score;
}

solver.part2 = cards => {
    const cardCounts = arr(cards.length, 1);

    for (const [index, card] of cards.entries()) {
        const matches = card.mine.filter(my => card.wins.includes(my)).length;
        for (let i = 1; i <= matches; i++) {
            if (index + i < cardCounts.length) cardCounts[index + i] += cardCounts[index];
        }
    }
    Solver.log(cardCounts);
    return cardCounts.reduce((a, b) => a + b);
}

solver.test(`Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`, 13, 30);

solver.run();
