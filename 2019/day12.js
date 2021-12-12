
let input = `<x=-3, y=10, z=-1>
<x=-12, y=-10, z=-5>
<x=-9, y=0, z=10>
<x=7, y=-5, z=-3>`;

// let input = `<x=-1, y=0, z=2>
// <x=2, y=-10, z=-7>
// <x=4, y=-8, z=8>
// <x=3, y=5, z=-1>`;

let moons = input.split('\n').map(el => ({
    pos: el.replace('<x=', '').replace('>', '').split(/, \w=/).map(n => n - 0),
    vel: [0, 0, 0]
}));


let time = 0;
function step() {
    time++;

    // Apply gravity
    for (let i = 0; i < moons.length; i++) {
        for (let j = i + 1; j < moons.length; j++) {
            // For each pair i,j

            for (let dim = 0; dim < 3; dim++) {
                // For each dimension

                if ( moons[i].pos[dim] < moons[j].pos[dim] ) {
                    moons[i].vel[dim]++;
                    moons[j].vel[dim]--;
                }
                if ( moons[i].pos[dim] > moons[j].pos[dim] ) {
                    moons[i].vel[dim]--;
                    moons[j].vel[dim]++;
                }
            }
        }
    }

    // Apply velocity
    for (let m of moons) {
        for (let dim = 0; dim < 3; dim++) {
            m.pos[dim] += m.vel[dim];
        }
    }
}


// while (time < 1000) { step(); }

step();
while (!checkInitial()) { step(); }

console.log(time);
console.log(moons);
console.log(calcEnergy());

function calcEnergy() {
    let total = 0;
    for (let m of moons) {
        let Epot = m.pos.map(n => Math.abs(n)).reduce((a, b) => a + b, 0);
        let Ekin = m.vel.map(n => Math.abs(n)).reduce((a, b) => a + b, 0);
        total += Epot * Ekin;
    }
    return total;
}


function checkInitial() {
    for (let m of moons) {
        for (let dim = 0; dim < 3; dim++) {
            if (m.vel[dim] != 0) return false;
        }
    }
    return true;
}