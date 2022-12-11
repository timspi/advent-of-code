// const PRGM = [3,8,1001,8,10,8,105,1,0,0,21,46,55,68,89,110,191,272,353,434,99999,3,9,1002,9,3,9,1001,9,3,9,102,4,9,9,101,4,9,9,1002,9,5,9,4,9,99,3,9,102,3,9,9,4,9,99,3,9,1001,9,5,9,102,4,9,9,4,9,99,3,9,1001,9,5,9,1002,9,2,9,1001,9,5,9,1002,9,3,9,4,9,99,3,9,101,3,9,9,102,3,9,9,101,3,9,9,1002,9,4,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,99,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,99,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,99];
const PRGM = [3,23,3,24,1002,24,10,24,1002,23,-1,23,
  101,5,23,23,1,24,23,23,4,23,99,0,0];

const Computer = require('./intcode2');

// class EventBus {

//   callbacks = {};

//   emit(name, data) {
//     let cbks = this.callbacks[name];
//     if (cbks) {
//       cbks.forEach(cbk => cbk(data));
//     }
//   }

//   subscribe(name, cbk) {
//     if (!this.callbacks[name]) {
//       this.callbacks[name] = [];
//     }
//     this.callbacks[name].push(cbk);
//   }

// }

// const bus1 = new EventBus();
// const bus2 = new EventBus();
// const bus3 = new EventBus();
// const bus4 = new EventBus();
// const bus5 = new EventBus();

// const amp1 = new Computer(bus1, bus2);
// const amp2 = new Computer(bus2, bus3);
// const amp3 = new Computer(bus3, bus4);
// const amp4 = new Computer(bus4, bus5);
// const amp5 = new Computer(bus5, bus1);

// comp.run(PRGM, true, [2, 0]);

const phases = [0,1,2,3,4];

const comps = [];
phases.forEach(_ => {
  let c = new Computer();
  c.loadProgram(PRGM.slice());
  comps.push(c);
});

let max = 0;
let perms = perm(phases);
perms.forEach(p => {
    let res = test(p);
    if (res > max) max = res;
});
console.log('maximum is ' + max);

// test([4,3,2,1,0]);

function test(vals) {
  let carry = 0;
  let i = 0;
  comps.forEach(c => c.loadProgram(PRGM.slice()));
  while (true) {
    comps[i].addInputValues(vals[i], carry);
    carry = comps[i].run();
    if (carry === undefined) break; // HALT
    i++;
    if (i >= comps.length) i = 0;
  }
  return carry;
}


// function test(vals) {
//     let carry = 0;
//     vals.forEach(val => {
//         let prgm = PRGM.slice();
//         comp.run(prgm, false, [val, carry]);
//         // carry = prgm[15];
//         carry = prgm[9];
//     })
//     return carry;
// }

function perm(xs) {
    let ret = [];
  
    for (let i = 0; i < xs.length; i = i + 1) {
      let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));
  
      if(!rest.length) {
        ret.push([xs[i]])
      } else {
        for(let j = 0; j < rest.length; j = j + 1) {
          ret.push([xs[i]].concat(rest[j]))
        }
      }
    }
    return ret;
}