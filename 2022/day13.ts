import { BLOCKS, Solver } from "./solver";

type Packet = (number | Packet)[];

const solver = new Solver(BLOCKS);

solver.part1 = data => {
    let count = 0;
    for (const [i, block] of data.entries()) {
        const pair: [Packet, Packet] = block.split('\n').map(el => JSON.parse(el)) as any;
        Solver.log('\n\n' + (i + 1));
        const isRightOrder = check(...pair);
        if (isRightOrder) count += i + 1;
    }
    return count;
};

solver.part2 = data => {
    const packets: Packet[] = [
        [[2]],
        [[6]]
    ];
    for (const block of data) {
        packets.push(...block.split('\n').map(el => JSON.parse(el)));
    }

    packets.sort((a, b) => {
        const res = check(a, b);
        switch (res) {
            case true: return -1;
            case false: return 1;
            default: return 0;
        }
    });

    const packetStrs = packets.map(p => JSON.stringify(p));
    return (packetStrs.indexOf('[[2]]') + 1) * (packetStrs.indexOf('[[6]]') + 1);
};


function check(left: Packet, right: Packet): boolean | undefined {
    Solver.log('check', left, right);

    for (let i = 0; i < left.length; i++) {
        if (i >= right.length) {
            Solver.log('fail: Right side ran out of items, so inputs are not in the right order');
            return false;
        }
        if (isArr(left[i]) || isArr(right[i])) {
            const lleft: Packet = isArr(left[i]) ? left[i] as Packet : [left[i]];
            const rright: Packet = isArr(right[i]) ? right[i] as Packet : [right[i]];
            const res = check(lleft, rright);
            if (res !== undefined) return res;
        } else {
            if (left[i] !== right[i]) {
                Solver.log(left[i] < right[i] ? 'ok:   Left side is smaller, so inputs are in the right order' : 'fail: Right side is smaller, so inputs are not in the right order');
                return left[i] < right[i];
            }
        }
    }

    if (right.length > left.length) {
        Solver.log('ok:   Left side ran out of items, so inputs are in the right order');
        return true;
    }
}

function isArr(el: number | Packet): el is Packet {
    return Array.isArray(el);
}


solver.test(`[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`, 13, 140);

solver.run();
