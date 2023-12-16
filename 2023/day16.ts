import { Solver } from "./solver";

interface Beam {
    pos: [number, number];
    dir: 'l' | 'r' | 'u' | 'd';
}

const solver = new Solver();

solver.part1 = data => run(data, { pos: [0, 0], dir: 'r' });

solver.part2 = data => {
    const lines = data.split('\n');
    const height = lines.length;
    const width = lines[0].length;

    let max = 0;

    for (let x = 0; x < width; x++) {
        const res1 = run(data, { pos: [x, 0], dir: 'd' });
        if (res1 > max) max = res1;

        const res2 = run(data, { pos: [x, height - 1], dir: 'u' });
        if (res1 > max) max = res1;
    }

    for (let y = 0; y < height; y++) {
        const res1 = run(data, { pos: [0, y], dir: 'r' });
        if (res1 > max) max = res1;

        const res2 = run(data, { pos: [width - 1, y], dir: 'l' });
        if (res2 > max) max = res2;
    }

    return max;
}

function run(data: string, initialBeam: Beam) {
    const map = data.split('\n').map(line => line.split('').map(obj => ({ obj, visited: { r: false, l: false, u: false, d: false } })));

    let beams: Beam[] = [initialBeam];

    while (beams.length > 0) {
        Solver.log(beams);
        const nextBeams: Beam[] = [];
        for (const beam of beams) {
            const pos = map[beam.pos[1]]?.[beam.pos[0]];
            if (!pos) continue; // beam ends
            if (pos.visited[beam.dir]) continue; // was already here

            pos.visited[beam.dir] = true;

            switch (beam.dir + pos.obj) {
                case 'u-':
                case 'd-':
                    nextBeams.push({ pos: [beam.pos[0] - 1, beam.pos[1]], dir: 'l' })
                case 'u/':
                case 'd\\':
                    beam.dir = 'r';
                case 'r.':
                case 'r-':
                    beam.pos[0]++;
                    break;

                case 'd/':
                case 'u\\':
                    beam.dir = 'l';
                case 'l.':
                case 'l-':
                    beam.pos[0]--;
                    break;

                case 'l|':
                case 'r|':
                    nextBeams.push({ pos: [beam.pos[0], beam.pos[1] + 1], dir: 'd' })
                case 'r/':
                case 'l\\':
                    beam.dir = 'u';
                case 'u.':
                case 'u|':
                    beam.pos[1]--;
                    break;

                case 'l/':
                case 'r\\':
                    beam.dir = 'd';
                case 'd.':
                case 'd|':
                    beam.pos[1]++;
                    break;

                default: throw "this should never happen";
            }

            nextBeams.push(beam);
        }
        beams = nextBeams;
    }

    return map.reduce((acc, line) => acc + line.reduce((acc2, pos) => acc2 + (Object.values(pos.visited).some(val => val) ? 1 : 0), 0), 0);
}

solver.test(`.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`, 46, 51);

solver.run();
