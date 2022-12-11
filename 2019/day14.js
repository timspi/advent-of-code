// let data = `10 ORE => 10 A
// 1 ORE => 1 B
// 7 A, 1 B => 1 C
// 7 A, 1 C => 1 D
// 7 A, 1 D => 1 E
// 7 A, 1 E => 1 FUEL`;

let data = `9 GJSNW, 9 GHJHK => 6 DRKW
1 SJNKX, 1 GHJHK, 7 DCPM => 1 BFGL
7 RBJHJ, 8 CHPCH, 1 SJHGH, 9 ZMRD, 2 VDVN, 17 SFSN, 4 DPZW => 9 TXWFP
1 KBJXG, 6 GJSNW, 2 RKBM => 9 QMVN
1 QMVN, 1 MWXF => 9 QZRM
1 ZPXS, 1 QZRM => 5 TWNV
1 RBJHJ => 9 BXGJ
4 RFLMC => 2 KRLSB
9 JBTL, 2 TZBZR => 4 WPXNJ
3 DCPM, 2 ZTLXS => 3 MWXF
3 QXFZ, 3 QTZW => 8 SJHGH
15 WPXNJ => 4 DXTFP
5 ZLJT, 3 GHJHK => 9 QXFZ
2 GHJHK => 8 LFQDQ
6 QMVN, 19 DRKW => 5 XCLVL
5 QTZW, 1 DCPM, 9 KBLFQ => 6 RPMHX
11 KBJXG => 1 TMXRJ
4 TKNB => 7 SFSN
29 XCLVL => 6 RBJHJ
5 BSMN, 11 MQZBK, 1 XCLVL, 12 BXGJ, 2 KDHT, 4 TMXRJ => 3 NCNMC
1 SPKZM, 1 TFWDG, 15 KRLSB => 8 MQZBK
21 DCPM, 18 QXFZ => 2 TZBZR
1 TMXRJ => 3 KBLFQ
5 BCBTD => 3 VDVN
1 DXTFP, 15 SPKZM => 5 DBWNB
5 ZTLXS => 8 QTZW
4 LFQDQ, 1 DRKW => 5 JBTL
6 XCLVL => 6 KDFC
2 TWNV, 29 CRDZ => 9 CXZG
11 KQVSV, 5 KSNJ => 7 ZMRD
150 ORE => 3 RKBM
9 QXFZ, 3 JBTL => 1 SJNKX
8 TXWFP, 1 BSMN, 6 WRTCX, 5 NCNMC, 12 RPMHX, 18 VZNQ, 1 ZPXS, 17 MGWHP, 15 CXZG => 1 FUEL
14 SJHGH, 1 KQVSV, 12 BCBTD, 17 QLQP, 11 JBLCQ, 2 KDHT, 2 JBTL => 9 WRTCX
2 TKNB, 11 KDFC => 9 SPKZM
122 ORE => 7 WXRBN
16 TZBZR => 1 ZPXS
2 KDHT => 5 QLQP
3 RKBM, 5 WXRBN => 6 ZLJT
26 MWXF, 6 MCXDR => 2 TKNB
2 SJNKX => 5 MCXDR
2 QXFZ => 8 DCPM
2 KBLFQ => 7 TFWDG
172 ORE => 9 GHJHK
2 CHPCH, 8 DPZW, 11 ZLJT => 2 CRDZ
2 SPKZM, 6 DCPM => 4 CHPCH
9 RPMHX, 5 KQVSV => 9 MGWHP
3 BFGL, 5 WPXNJ => 9 KSNJ
1 SJGC => 8 DPZW
1 BSMN => 5 BCBTD
2 ZTLXS, 1 KSNJ => 8 SJGC
186 ORE => 8 GJSNW
20 TKNB, 1 DXTFP, 11 QZRM => 7 KDHT
14 DXTFP => 7 BSMN
117 ORE => 6 KBJXG
2 WPXNJ => 4 VZNQ
4 RPFV, 1 ZMRD => 4 RFLMC
10 QTZW => 2 RPFV
2 QMVN, 6 LFQDQ, 7 GJSNW => 7 ZTLXS
33 QZRM => 4 KQVSV
1 SJHGH, 1 DPZW, 8 DBWNB => 8 JBLCQ`;

/* ATTEMPT 1 */

// data = data.replace(/ORE/g, '');

// let reactions = {};
// data.split('\n').forEach(line => {
//     let [ educt, product ] = line.split(' => ');
//     let [ quantity, title ] = product.split(' ');

//     let educts = educt.split(', ').map(el => el.split(' ')).map(el => `${Math.ceil(el[0] / quantity)} ${el[1]}`);

//     reactions[title] = `( ${educts.join(' + ')} )`;
// });

// console.log(reactions);

// let formula = '1 FUEL';
// while (/[A-Z]/.test(formula)) {
//     for (let from of Object.keys(reactions)) {
//         let to = reactions[from];
//         formula = formula.replace(new RegExp('\\b' + from + '\\b', 'g'), '* ' + to);
//     }
//     console.log(formula);
// }
// console.log(formula);


/* ATTEMPT 2 */

// Parse data
data = data.split('\n').map(l => {
    let [educt, product] = l.split(' => ');
    product = conv(product)
    let educts = educt.split(', ').map(el => conv(el));
    return { product, educts };
});
function conv(val) {
    let [ quantity, title ] = val.split(' ');
    return { title, quantity: quantity-0 };

}

let reactions = {};
data.forEach(d => {
    reactions[d.product.title] = {
        quantity: d.product.quantity,
        needed: d.educts
    };
})
// console.log(reactions);

// return;

// reactions = {
//     FUEL: { quantity: 1, needed: [ { title: 'FUEL', quantity: 1 } ] }
// }

let storage = {}, oreCounter = 0;
function getEductsFor(title, quantity) {
    // console.log('get ' + quantity + ' ' + title);
    if (title === 'ORE') {
        oreCounter += quantity;
        return;
    }

    // Reuse remaining chemicals
    let existing = storage[title];
    if (existing) {
        // console.log('from storage', existing);
        if (quantity > existing) {
            quantity -= existing;
            storage[title] = 0;
        } else {
            storage[title] = existing - quantity;
            return;
        }
    }

    // Get needed educts
    let r = reactions[title];
    let times = Math.ceil(quantity / r.quantity);

    // Save remaining chemicals for later
    let remaining = times*r.quantity - quantity;
    // console.log('saving ' + remaining);
    if (storage[title]) storage[title] += remaining;
    else storage[title] = remaining;


    r.needed.forEach(n => {
        // n === { title: 'FUEL', quantity: 1 }
        getEductsFor(n.title, times * n.quantity);
    });
    
    // DONE
}

// Part 1
getEductsFor('FUEL', 1);
console.log(oreCounter + ' ORE => 1 FUEL');


// Part 2
let capacity = 1000000000000;
let fuelCounter = 1;

// Optimize with result of part 1
let basicFuelAmount = Math.floor(capacity / oreCounter) - 1;
getEductsFor('FUEL', basicFuelAmount);
fuelCounter += basicFuelAmount;

// Now get one fuel until ORE is over capacity
let last_ore = 0;
while (oreCounter < capacity) {
    last_ore = oreCounter;
    getEductsFor('FUEL', 1);
    fuelCounter++;
}
console.log(`${oreCounter} ORE => ${fuelCounter} FUEL`);
console.log(`${last_ore} ORE => ${fuelCounter - 1} FUEL`);



999999968928