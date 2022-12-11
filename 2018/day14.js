let puzzleInput = 327901

let recipes = '37'
let elf1 = 0, elf2 = 1;

// Part 1
while(recipes.length < puzzleInput + 10) {
    run();
}
console.log('part1: ' + recipes.substr(puzzleInput,10));

// Part 2
while(recipes.substr(-10).indexOf(puzzleInput) === -1) {
    run();
    //recipes.substr(-10);
    //console.log(elf1 + ',' + elf2);
}
console.log('part2: ' + recipes.indexOf(puzzleInput));

function run() {
	let score1 = recipes.substr(elf1,1) - 0;
	let score2 = recipes.substr(elf2,1) - 0;
	recipes += score1+score2;
    elf1 = (elf1+score1+1) % recipes.length;
    elf2 = (elf2+score2+1) % recipes.length;
}
