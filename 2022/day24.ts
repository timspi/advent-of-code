import { Solver } from "./solver";
import { add, parseMapString, s2p } from "./util/map";

const solver = new Solver();

solver.part1 = data => {
    const map = parseMapString(data, '.');
    const blizzards = Object.entries(map).filter(([key]) => map[key] !== '#').map(([key, dir]) => [s2p(key), dir]);

    const lines = data.split('\n');
    const start = [lines[0].indexOf('.'), 0];
    const end = [lines[lines.length - 1].indexOf('.'), lines.length - 1];

    map[[start[0], -1].join()] = '#';

    const dirs = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1]
    ];

    // breadth first search
    let options: number[][] = [start];
    while (true) {
        const blizzardsPos = blizzards.map(([pos]) => pos.join());
        const nextOptions: number[][] = [];
        for (let opt of options) {
            for (let dir of dirs) {
                const next = add(opt, dir);
                if (map[next.join()] !== '#' && !blizzardsPos.includes(next.join())) {
                    nextOptions.push(next);
                }
            }

        }
        options = nextOptions;

        // move blizzards
        for (let i = 0; i < blizzards.length; i++) {
            // dirs[['>', 'v', '<', '^'].indexOf(dir)]
            switch (blizzards[i][1]) {
                case '>': blizzards[i][0] = add(blizzards[i][0], blizzards[i][1]); break;
                case 'v': break;
                case '<': break;
                case '^': break;
            }
            blizzards[i][0] = add(blizzards[i][0], blizzards[i][1]);
            if (blizzards[i][0][0] 
        }
    }
}

solver.test(`#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`, 18);

solver.run();
