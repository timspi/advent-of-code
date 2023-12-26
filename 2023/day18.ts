import { Field } from "../util/field";
import { drawPath } from "../util/svg";
import { Vec } from "../util/vector";
import { ROWS, Solver } from "./solver";

const solver = new Solver(ROWS);

// function floodFill(field: Field, bounds: Bounds, x: number, y: number) {
//     // Solver.log(x, y, field.has(x, y));
//     // if (field.has(x, y)) return;
//     if (x < bounds.minX || x > bounds.maxX || y < bounds.minY || y > bounds.maxY) {
//         throw new Error(`Area not contained! Left at ${x},${y}.`);
//     }

//     field.set(x, y, '#');

//     if (!field.has(x - 1, y)) floodFill(field, bounds, x - 1, y);
//     if (!field.has(x + 1, y)) floodFill(field, bounds, x + 1, y);
//     if (!field.has(x, y - 1)) floodFill(field, bounds, x, y - 1);
//     if (!field.has(x, y + 1)) floodFill(field, bounds, x, y + 1);
// }

solver.part1 = data => {
    let field = new Field();
    const pos = [0, 0];
    for (const line of data) {
        const [dir, len] = line.split(' ');
        for (let i = 0; i < Number(len); i++) {
            field.set(pos[0], pos[1], '#');
            switch (dir) {
                case 'L': pos[0]--; break;
                case 'R': pos[0]++; break;
                case 'U': pos[1]--; break;
                case 'D': pos[1]++; break;
            }
        }
    }
    Solver.log(field.toMapString(5, 5));

    const bounds = field.getBounds();
    Solver.log(bounds);

    field.fillSpace(1, 1, '#');

    Solver.log('\n\n' + field.toMapString());

    // let count = 0;
    // let isInside = false;
    // let borderStart = false;
    // for (let x = bounds.minX; x <= bounds.maxX; x++) {
    //     for (let y = bounds.minY; y <= bounds.maxY; y++) {
    //         const isBorder = field.has(x, y);
    //         if (!isOnBorder && isBorder) isInside = !isInside;
    //         if (!isInside) {
    //             if (isBorder) isInside = true;
    //         } else {
    //             if (isOnBorder !== isBorder) isInside = false;
    //             else if (isOnBorder && !isBorder) {
    //                 isOnBorder = false;
    //                 isInside = false;
    //             }
    //         }
    //         lastWasBorder = isBorder;
    //         if (isInside) count++;
    //     }
    // }
    return field.getEntries().length;
};


solver.part2 = data => {
    let pos = new Vec();
    const edge: Vec[] = [pos.clone()];
    for (const line of data) {
        const code = line.split('#')[1];
        const dir = 'RDLU'[Number(code.substring(5, 6))];
        const len = Number.parseInt(code.substring(0, 5), 16);

        switch (dir) {
            case 'L': pos.add(new Vec(-len, 0)); break;
            case 'R': pos.add(new Vec(len, 0)); break;
            case 'U': pos.add(new Vec(0, -len)); break;
            case 'D': pos.add(new Vec(0, len)); break;
        }
        edge.push(pos.clone());
    }
    Solver.log(edge);
    drawPath('foo', edge);
    return 0;
};

solver.test(`R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`, 62, 952408144115);

solver.run();
