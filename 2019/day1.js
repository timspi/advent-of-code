const DATA = require('./data/day1.js');

let sum = DATA.map(calcFuel).reduce((a, b) => a + b);
console.log('Fuel consumtion is ' + sum);

let total = DATA.map(calcTotalFuel).reduce((a, b) => a + b);
console.log('Total fuel consumtion is ' + total);

function calcFuel(mass) {
    return Math.floor(mass / 3) - 2;
}

function calcTotalFuel(mass) {
    let fuel = 0;
    while(1) {
        mass = Math.floor(mass / 3) - 2;
        if (mass > 0) fuel += mass;
        else return fuel;
    }
}