import { writeFileSync } from "fs";
import { basename } from "path";
import { Vec } from "./vector";

const svgHead = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 1186328 1186328">`;
const svgFoot = `</svg>`;

export function drawPath(name: string, path: Vec[]) {
    const day = basename(process.argv[1], '.ts');

    const instructions: string[] = [];
    const [start] = path.splice(0, 1);
    instructions.push(`M ${start.x} ${start.y}`);
    for (const pt of path) {
        instructions.push(`L ${pt.x} ${pt.y}`);
    }
    let svgPath = `<path d="${instructions.join(' ')}" fill="black" stroke="none" />`;

    const svg = [
        svgHead,
        svgPath,
        svgFoot
    ];
    writeFileSync(`${day}_${name}.svg`, svg.join('\n'));
}
