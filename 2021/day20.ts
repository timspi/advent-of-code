import { readFileSync } from 'fs';
import { basename } from 'path';

const [algorithmStr, imageStr] = readFileSync('data/' + basename(__filename, '.ts'), 'utf-8').split('\n\n');

const algorithm = algorithmStr.split('\n').join('');
const image = imageStr.split('\n').map(line => line.split(''));

// part1
const enhanced = enhance(enhance(image, '.'), algorithm[0]);
console.log(countLitPixels(enhanced));

// part 2
let extendWith = '.';
let currImage = image;
for (let i = 0; i < 50; i++) {
    currImage = enhance(currImage, extendWith);
    extendWith = extendWith === '.' ? algorithm[0] : algorithm[0b111111111];
}
console.log(countLitPixels(currImage));



function countLitPixels(img: string[][]) {
    const str = img.map(line => line.join('')).join('\n');
    let litPixels = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '#') litPixels++;
    }
    return litPixels;
}

function enhance(orig: string[][], extendWith: string) {
    const img: string[][] = [];
    for (let row = -1; row < orig.length + 1; row++) {
        for (let col = -1; col < orig[0].length + 1; col++) {
            let num = 0;
            for (let i = 0; i < 9; i++) {
                const line = orig[row - 1 + Math.floor(i / 3)];
                const pixel = line ? (line[col - 1 + (i % 3)] || extendWith) : extendWith;
                num <<= 1;
                if (pixel === '#') num++;
            }
            if (!img[row + 1]) img[row + 1] = [];
            img[row + 1][col + 1] = algorithm[num];
        }
    }
    return img;
}
