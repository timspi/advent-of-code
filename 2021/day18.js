const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8').split('\n');

// const numbers = data.map(num => JSON.parse(num));

// // console.log(numbers[0]);
// // for (let num of numbers) {
// //     console.log(num);
// //     getDepth(num);
// //     console.log('\n');
// // }

// let num = [[[[[9,8],1],2],3],4]; 
// getDepth(num);
// console.log(num);

// function getDepth(num, depth = 0) {
//     if (typeof num[0] != 'number') {
//         const res = getDepth(num[0], depth + 1);
//         if (res) {
//             const [l,r] = num[0];
//             num[0] = 0;
//         }
//     }
//     if (typeof num[1] != 'number') {
//         getDepth(num[1], depth + 1);
//     }
//     if (typeof num[0] == 'number' && typeof num[1] == 'number' && depth >= 4) {
//         // explode
//         return true;
//     }
// }

// let num = data[0];
// let num = '[[[[[9,8],1],2],3],4]';
// let num = '[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]';

// let numobj = {
//     l: {
//         l: {
//             l: {
//                 l: {
//                     l: 9,
//                     r: 8
        
//                 },
//                 r: 1
    
//             },
//             r: 2

//         },
//         r: 3
//     },
//     r: 4
// }

// num = explode(num);
// console.log(num);

// num = explode(num);
// console.log(num);


function explode(num = '')  {
    let depth = 0;
    for (let i = 0; i < num.length; i++) {
        if (num[i] == '[') depth++;
        if (num[i] == ']') depth--;

        const rest = num.substring(i);
        if (depth > 4 && /^\d+,\d+/.test(rest)) {
            const [l,r] = rest.split(']')[0].split(',');
            let pre = num.substring(0, i - 1);
            let post = rest.substring(rest.indexOf(']') + 1);
            // console.log('need to explode ' + rest.substring(0, rest.indexOf(']')));
            // console.log(pre);
            // console.log(post);
            const preMatch = [...pre.matchAll(/\d+/g)].pop();
            const [postMatch] = [...post.matchAll(/\d+/g)].splice(0, 1);
            // console.log(postMatch);

            if (preMatch) {
                pre = pre.substr(0, preMatch.index) + (Number(preMatch[0]) + Number(l)) + pre.substr(preMatch.index + preMatch[0].length);
            }
            if (postMatch) {
                post = post.substr(0, postMatch.index) + (Number(postMatch[0]) + Number(r)) + post.substr(postMatch.index + postMatch[0].length);
            }

            return pre + '0' + post;
        }
    }
    return num;
}

function split(num = '')  {
    const match = num.match(/\d{2,}/);
    if (match) {
        const numHalf = Number(match[0]) / 2;
        const rep = `[${Math.floor(numHalf)},${Math.ceil(numHalf)}]`;
        return num.substr(0, match.index) + rep + num.substr(match.index + match[0].length);
    }
    return num;
}

function add(num1, num2) {
    let num = `[${num1},${num2}]`;
    let prev;
    while (prev != num) {
        prev = num;
        num = explode(num);
        if (prev != num) continue;
        num = split(num);
    }
    return num;
}

function magnitude(num = '') {
    while (isNaN(Number(num))) {
        let matches = [...num.matchAll(/\[(\d+),(\d+)\]/g)];
        for (let m of matches) {
            num = num.replace(m[0], 3 * m[1] + 2 * m[2]);
        }
    }
    return num;
}


const sum = data.reduce((a, b) => add(a, b));
// console.log(sum);
console.log(magnitude(sum));

let max = 0;
for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
        if (i == j) continue;

        const mag = magnitude(add(data[i], data[j]))
        if (mag > max) max = mag;
    }
}

console.log(max);
