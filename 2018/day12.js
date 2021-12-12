function getAllIndexes(str, val) {
    var indexes = [], i;
    for(i = 0; i < str.length-val.length; i++)
        if (str.substr(i,val.length) === val)
            indexes.push(i);
    return indexes;
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

function runGeneration() {
	let addDashes = Math.max(0, 5 - state.indexOf('#'));
	let addDashesEnd = Math.max(0, 6 - state.length + state.lastIndexOf('#'));
	offset += addDashes;
	state = "".padEnd(addDashes, '.') + state + "".padEnd(addDashesEnd, '.');
    let newState = state.replace(/#/g, '.');
    data.forEach(el => {
        let indices = getAllIndexes(state, el);
        indices.forEach(index => {
            newState = setCharAt(newState, index+2, '#');
        });
    })
	state = newState;
}

let offset = 0;
let state = '#....#.#....#....#######..##....###.##....##.#.#.##...##.##.#...#..###....#.#...##.###.##.###...#..#';

let data = [];
`#..#. => #
#...# => #
.##.# => #
#.... => .
..#.. => .
#.##. => .
##... => #
##.#. => #
.#.## => #
.#.#. => .
###.. => .
#..## => .
###.# => .
...## => .
#.#.. => #
..... => .
##### => #
..### => .
..#.# => #
....# => .
...#. => #
####. => #
.#... => #
#.#.# => #
.##.. => #
..##. => .
##..# => .
.#..# => #
##.## => #
.#### => .
.###. => #
#.### => .`.split('\n').forEach(el => {
    if(el.endsWith('#')) data.push(el.substr(0,5));
});

for(var i = 0; i < 20; i++) {
	runGeneration();
}

console.log(state);

let counter = 0;
state.split('').forEach((el,i)=> {
    if(el === '#') counter += i-offset;
})

console.log(counter);



// Part 2

// Run more generations to see if there is a pattern
for(var i = 0; i < 80; i++) {
	console.log(state);
	runGeneration();
}

// Code has pattern, after around 100 iterations, every generation just shifts to the right by one
// So shift by 50 billion and 100 back (already ran 100 gens)

counter = 0;
state.split('').forEach((el,i)=> {
    if(el === '#') counter += i+50000000000-100-offset;
});

console.log(counter);
