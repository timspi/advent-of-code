const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8').split('');

const bits_conv = [].concat(...data.map(hex => parseInt(hex, 16).toString(2)));
const bits = [].concat(...bits_conv.map(bit => bit.padStart(4, '0').split('').map(Number)));

let sum_part1 = 0;


function extractInfo(packet = []) {
    const version = parseInt(packet.splice(0, 3).join(''), '2');
    const id = parseInt(packet.splice(0, 3).join(''), '2');
    return { version, id };
}

function extractLiteralValue(packet = []) {
    let num = [];
    let cont, val;
    do {
        [cont, ...val] = packet.splice(0, 5);
        num.push(...val);
    } while (cont == 1);
    return parseInt(num.join(''), 2);
}


function parse(packets) {
    const { version, id } = extractInfo(packets);
    sum_part1 += version;

    if (id == 4) {
        const val = extractLiteralValue(packets);
        // console.log('literal value', val);
        return val;

    } else {
        // operator
        const [ len_identifier ] = packets.splice(0, 1);
        const values = [];
        if (len_identifier == 0) {
            const subpacketlen_bits = parseInt(packets.splice(0, 15).join(''), 2);
            const remainder_bits = packets.length - subpacketlen_bits;
            while (packets.length > remainder_bits) {
                values.push(parse(packets));
            }
        } else {
            let subpacketnum = parseInt(packets.splice(0, 11).join(''), 2);
            while (subpacketnum--) {
                values.push(parse(packets));
            }
        }

        switch (id) {
            case 0: return values.reduce((a, b) => a + b, 0); // sum
            case 1: return values.reduce((a, b) => a * b, 1); // prod
            case 2: return Math.min(...values); // min
            case 3: return Math.max(...values); // max
            case 5: return values[0] > values[1] ? 1 : 0; // gt
            case 6: return values[0] < values[1] ? 1 : 0; // lt
            case 7: return values[0] == values[1] ? 1 : 0; // eq

            default:
                throw new Error('Unknown id');
        }
    }
}

const val = parse(bits);

console.log(sum_part1);
console.log(val);
