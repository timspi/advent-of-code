import { ROWS, Solver } from "./solver";

const solver = new Solver(ROWS);

enum Strength {
    FiveOfAKind = 7,
    FourOfAKind = 6,
    FullHouse = 5,
    ThreeOfAkind = 4,
    TwoPairs = 3,
    Pair = 2,
    HighCard = 1
};

function getStrength(hand: string, JisJoker = false) {
    const counts: { [card: string]: number } = {};
    let jokerCount = 0;
    for (const c of hand) {
        if (JisJoker && c === 'J') jokerCount++;
        else counts[c] = counts[c] ? counts[c] + 1 : 1;
    }
    const xOfAKind: { [key: number]: number } = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    };
    for (const num of Object.values(counts)) {
        xOfAKind[num]++;
    }


    if (jokerCount >= 4) {
        return Strength.FiveOfAKind;
    }
    if (jokerCount === 3) {
        return xOfAKind[2] ? Strength.FiveOfAKind : Strength.FourOfAKind;
    }
    if (jokerCount === 2) {
        if (xOfAKind[3]) return Strength.FiveOfAKind;
        if (xOfAKind[2]) return Strength.FourOfAKind;
        return Strength.ThreeOfAkind;
    }
    if (jokerCount === 1) {
        if (xOfAKind[4]) return Strength.FiveOfAKind;
        if (xOfAKind[3]) return Strength.FourOfAKind;
        if (xOfAKind[2] >= 2) return Strength.FullHouse;
        if (xOfAKind[2]) return Strength.ThreeOfAkind;
        return Strength.Pair;
    }

    // No jokers:
    if (xOfAKind[5]) return Strength.FiveOfAKind;
    if (xOfAKind[4]) return Strength.FourOfAKind;
    if (xOfAKind[3] && xOfAKind[2]) return Strength.FullHouse;
    if (xOfAKind[3]) return Strength.ThreeOfAkind;
    if (xOfAKind[2] >= 2) return Strength.TwoPairs;
    if (xOfAKind[2]) return Strength.Pair;
    return Strength.HighCard;
}

function evaluate(data: string[], isPart2: boolean) {
    const ranks = isPart2 ? 'AKQT98765432J' : 'AKQJT98765432';

    const hands = data.map(line => {
        const [hand, bid] = line.split(' ');
        const strength = getStrength(hand, isPart2);
        return { hand, bid: Number(bid), strength };
    });

    hands.sort((a, b) => {
        if (a.strength !== b.strength) return a.strength - b.strength;
        for (let i = 0; i < a.hand.length; i++) {
            const indA = ranks.indexOf(a.hand[i]);
            const indB = ranks.indexOf(b.hand[i]);
            if (indA === indB) continue;
            return indB - indA;
        }
        return 0;
    });
    Solver.log(hands);

    return hands.reduce((acc, hand, i) => acc + hand.bid * (i + 1), 0);
}

solver.part1 = data => evaluate(data, false);
solver.part2 = data => evaluate(data, true);

solver.test(`32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`, 6440, 5905);

solver.run();
