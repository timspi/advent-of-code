
let input = `<x=-3, y=10, z=-1>
<x=-12, y=-10, z=-5>
<x=-9, y=0, z=10>
<x=7, y=-5, z=-3>`;

// let input = `<x=-1, y=0, z=2>
// <x=2, y=-10, z=-7>
// <x=4, y=-8, z=8>
// <x=3, y=5, z=-1>`;

let allMoons = input.split('\n').map(el => ({
    pos: el.replace('<x=', '').replace('>', '').split(/, \w=/).map(n => n - 0),
    vel: [0, 0, 0]
}));

let moons, moons_initial, time;

function step() {
    time++;

    let isInitial = true;

    for (let i = 0; i < moons.length; i++) {
        for (let j = i + 1; j < moons.length; j++) {
            // For each pair i,j
            if ( moons[i].pos < moons[j].pos ) {
                moons[i].vel++;
                moons[j].vel--;
            }
            if ( moons[i].pos > moons[j].pos ) {
                moons[i].vel--;
                moons[j].vel++;
            }
        }
        if (moons[i].vel != 0) {
            isInitial = false;
            moons[i].pos += moons[i].vel;
        }
    }
    if (isInitial) {
        for (let i = 0; i < moons.length; i++) {
            if (moons[i].pos != moons_initial[i].pos) return true;
        }
    }
    return !isInitial;
}


// while (time < 1000) { step(); }

// calc for first dim

for (let i = 0; i < 3; i++) {
    moons = allMoons.map(m => ({ pos: m.pos[i], vel: m.vel[i] }));
    moons_initial = JSON.parse(JSON.stringify(moons)); // .slice(); .filter(el => true);
    time = 0;

    console.log('dim' + i + ': ', moons);

    // step();
    while (step()) { }

    console.log(time);
    console.log(moons);
    // console.log(calcEnergy());
    console.log('\n');
}


function calcEnergy() {
    let total = 0;
    for (let m of moons) {
        total += Math.abs(m.pos) * Math.abs(m.vel);
    }
    return total;
}
