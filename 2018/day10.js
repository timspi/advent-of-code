let data = document.documentElement.innerText.split('\n').map(el => {
    [_,x,y,_,dx,dy,_] = el.split(/[, <>] */);
    return {
        x: x-0,
        y: y-0,
        dx: dx-0,
        dy: dy-0,
    };
})
let c = document.createElement('canvas');
document.querySelector('body').prepend(c);
let ctx = c.getContext('2d');
data.forEach(el => {
	el.x += 10800 * el.dx;
	el.y += 10800 * el.dy;
});
function run(dir = 1) {
	let x_min = data.reduce((a,b) => a.x > b.x ? b : a).x - 10;
	let x_max = data.reduce((a,b) => a.x < b.x ? b : a).x + 10;
	let y_min = data.reduce((a,b) => a.y > b.y ? b : a).y - 10;
	let y_max = data.reduce((a,b) => a.y < b.y ? b : a).y + 10;
	c.width = x_max - x_min;
	c.height = y_max - y_min;
    ctx.clearRect(0,0,c.width,c.height);
    data.forEach(el => {
		el.x += dir * el.dx;
		el.y += dir * el.dy;
        ctx.fillRect(el.x-x_min, el.y-y_min, 1, 1);
    });
}
