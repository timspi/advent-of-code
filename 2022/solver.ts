import { readFile, writeFile } from 'fs';
import { basename } from 'path';
import { config } from 'dotenv';
import axios from 'axios';

config();

type TransformFuntion<T> = (data: string) => T;
type SolveFuntion<T> = (data: T) => string | number;

const isTestMode = process.argv[2] === 'test';

export class Solver<T = string> {
    private data: string;
    private transform?: TransformFuntion<T>;

    result1?: string | number;
    result2?: string | number;

    part1?: SolveFuntion<T>;
    part2?: SolveFuntion<T>;

    constructor(transform?: TransformFuntion<T>) {
        this.data = '';
        this.transform = transform;
    }

    static log(...params: any) {
        if (isTestMode) {
            console.log(...params);
        }
    }

    test(data: string, result1: string | number, result2?: string | number) {
        const transformedData = this.transform ? this.transform(data) : data as T;
        if (this.part1) {
            const evaluated1 = this.part1(transformedData);
            if (evaluated1 != result1) {
                console.log(`Test for part1 failed!`);
                console.log(`Expected "${result1}", but got "${evaluated1}"`);
                process.exit(1);
            }
            console.log('Test for part1 passed');
        }
        if (this.part2 && result2) {
            const evaluated2 = this.part2(transformedData);
            if (evaluated2 != result2) {
                console.log(`Test for part2 failed!`);
                console.log(`Expected "${result2}", but got "${evaluated2}"`);
                process.exit(1);
            }
            console.log('Test for part2 passed');
        }
        if (!isTestMode) console.log('');
    }

    async run() {
        if (isTestMode) return;

        await this.loadData();

        let data: T;
        const transformTime = this.timeIt(
            () => data = this.transform ? this.transform(this.data) : this.data as T
        );
        if (this.transform) {
            console.log(`Transformed input in ${transformTime}\n`);
        }

        if (this.part1) {
            const time = this.timeIt(
                () => this.result1 = this.part1 ? this.part1(data) : undefined
            );
            console.log(`Result of part1: (calculated in ${time})`);
            console.log(this.result1);

            if (this.part2) console.log('');
        }
        if (this.part2) {
            const time = this.timeIt(
                () => this.result2 = this.part2 ? this.part2(data) : undefined
            );
            console.log(`Result of part2: (calculated in ${time})`);
            console.log(this.result2);
        }
    }

    private loadData() {
        const day = basename(process.argv[1], '.ts');

        return new Promise<void>((resolve, reject) => {
            readFile(`data/${day}`, 'utf-8', async (err, data) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        // Load file from adeventofcode.com
                        console.log('Fetching puzzle input\n');
                        const resp = await axios.get(`https://adventofcode.com/2022/day/${day.slice(3)}/input`, {
                            headers: {
                                cookie: `session=${process.env.SESSION_TOKEN}`
                            }
                        });
                        this.data = resp.data.trim();
                        writeFile(`data/${day}`, this.data, 'utf-8', (err) => err ? reject(err) : resolve());
                    } else {
                        reject(err);
                    }
                } else {
                    this.data = data;
                    resolve();
                }
            });
        });
    }

    private timeIt(fun: Function) {
        const toNanoSeconds = (hrTime: [number, number]) => (hrTime[0] * 1000000000 + hrTime[1])

        const start = process.hrtime()
        fun();

        let time = toNanoSeconds(process.hrtime()) - toNanoSeconds(start)

        let unit: string = '';
        for (unit of ['ns', 'µs', 'ms', 's']) {
            if (time < 1000) break;
            time /= 1000;
        }
        return `${Math.round(time)}${unit}`;
    }
}


export const ROWS: TransformFuntion<string[]> = data => {
    return data.split('\n');
};

export const BLOCKS: TransformFuntion<string[]> = data => {
    return data.split('\n\n');
};

export const CSV: TransformFuntion<string[]> = data => {
    return data.split(',');
};
