const DATA = require('./data/day5.js');

const Computer = require('./intcode.js');
const comp = new Computer([ 5 ]); // input values

comp.run(DATA, true);

// console.log(comp.toASM(DATA));

// comp.run([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9]);