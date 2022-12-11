// Read data
let data = document.documentElement.innerText.split('\n').map(el => {
    return el.split('');
})

// Extract carts from map
let carts = [];
data.forEach((row,y) => {
    row.forEach((el,x) => {
        if ('<>^v'.includes(el)) carts.push({dir: el, x, y});
    });
});

// Remove carts to generate a default map
let map = data.slice();
carts.forEach(cart => {
    map[cart.y][cart.x] = '<>'.includes(cart.dir) ? '-' : '+';
});

function run() {
    carts.forEach((cart,index) => {
		// Update cart position
        switch(cart.dir) {
            case '<': cart.x--; break;
            case '>': cart.x++; break;
            case '^': cart.y--; break;
            case 'v': cart.y++; break;
        }
		// Update cart direction
        switch(map[cart.y][cart.x]) {
            case '/': cart.dir = getDirSlash(cart.dir);
            case '\\': cart.dir = getDirBackslash(cart.dir);
        }
        
		// Check collision
        collision = checkCollision(cart,index);
		if(collision) console.log(cart, JSON.stringify(cart));
    });
}

function getDirBackslash(dir) {
    switch(dir) {
        case '<': return '^';
        case '>': return 'v';
        case 'v': return '<';
        case '^': return '>';
    }
}
function getDirSlash(dir) {
    switch(dir) {
        case '<': return 'v';
        case '>': return '^';
        case 'v': return '>';
        case '^': return '<';
    }
}
function checkCollision(cart, index) {
    for(let i = 0; i < carts.length; i++) {
        if(index !== i) {
            if(cart.x == carts[i].x && cart.y == carts[i].y) return true;
        }
    }
    return false;
}

let collision = false;
function go() {
	setTimeout(() => {
    	run();
		if(!collision) go();
    });
}

