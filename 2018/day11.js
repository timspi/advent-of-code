let serialNo = 6548;
let field = [];
for(var x = 1; x <= 300; x++) {
	let arr = [];
    for(var y = 1; y <= 300; y++) {
        let rackID = x + 10;
		let powerLevel = rackID * y + serialNo;
		powerLevel *= rackID;
		let hundretsDigit = Math.floor(powerLevel / 100) % 10;
		arr.push(hundretsDigit - 5);
    }
    field.push(arr);
}


let current = {powerLevel: 0};
for(var x = 1; x <= 300-3; x++) {
	for(var y = 1; y <= 300-3; y++) {

		let powerLevel = 0;
		for(var i = 0; i < 3; i++) {
	        for(var j = 0; j < 3; j++) {
	    		powerLevel += field[x-1+i][y-1+j];
	        }
	    }
		if (powerLevel > current.powerLevel) current = {x,y,powerLevel};
	
	}
}
console.log('Part 1: ' + current.x + ',' + current.y, current);


// Part 2: (very unefficient)
for(let size = 1; size <= 300; size++) {
	console.log(size);
    for(var x = 1; x <= 300-size; x++) {
        for(var y = 1; y <= 300-size; y++) {

            let powerLevel = 0;
            for(var i = 0; i < size; i++) {
                for(var j = 0; j < size; j++) {
                    powerLevel += field[x-1+i][y-1+j];
                }
            }
            if (powerLevel > current.powerLevel) current = {x,y,size,powerLevel};

        }
    }
}
console.log('Part 2: ' + current.x + ',' + current.y + ',' + current.size, current);
