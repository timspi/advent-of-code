import { Solver } from "./solver";

const solver = new Solver(data => data.split('\n').map(line => {
    const sets = line.split(': ')[1].split('; ');
    const game: Record<string, number> = { red: 0, green: 0, blue: 0 };
    for (const set of sets) {
        for (const el of set.split(', ')) {
            const [countStr, color] = el.split(' ');
            const count = Number(countStr);
            if (game[color] < count) game[color] = count;
        }
    }
    return game;
}));

solver.part1 = games => games.reduce((acc, game, ind) => {
    const playable = game.red <= 12 && game.green <= 13 && game.blue <= 14;
    return acc + (playable ? ind + 1 : 0);
}, 0);

solver.part2 = games => games.reduce((acc, game) => acc + game.red * game.green * game.blue, 0);

solver.test(`Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`, 8, 2286);

solver.run();
