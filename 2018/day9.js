function play(marbleCount, playerCount) {
    let current = 0;
	let circle = [0];
	let index = 0;
	let scores = Array.apply(null, {length: playerCount}).map(el => 0);
    for(let marble = 1; marble <= marbleCount; marble++) {
        if(marble % 23 !== 0) {
            current = (current + 2) % circle.length;
            circle.splice(current, 0, marble);
        } else {
            current = (current - 7) % circle.length;
            if (current < 0) current += circle.length;
            scores[index] += marble + circle.splice(current,1)[0];
            current %= circle.length;
        }
        index++;
        index %= scores.length;
    }
	return Math.max(...scores);
}
