let data = `#######
#.G.E.#
#E.G.E#
#.G.E.#
#######`;

let map = parseMap(data);
let units = extractUnits(map);
console.log(units);


function parseMap(data) {
    let map = data.split('\n');
    map = map.map(el => el.split(''));
    return map;
}

function extractUnits(data) {
    let units = [];
    map.forEach((row,y) => {
        row.forEach((el,x) => {
            if (el === 'G' || el === 'E' ) {
                units.push({
                    type: el,
                    attackPower: 3,
                    hitPoints: 200,
                    x,
                    y,
                });
            }
        });
    });
    return units;
}

function run(map, units) {
    units.sort(readingOrder);
    units.forEach(unit => {
        [adjacents,indices] = getAdjacents(map, unit);
        let enemyType = getEnemy(unit);
        if (adjacents.includes(enemyType)) {
            // Attack
            let enemies = [];
            indices.forEach(i => {
                if (i !== -1) {
                    let unit = units[i];
                    if (unit.type === enemyType) enemies.push(unit);
                }
            });
            let hitPoints = enemies.map(e => e.hitPoints);
            let enemy = enemies[hitPoints.indexOf(Math.max(...hitPoints))]
            enemy.hitPoints -= unit.attackPower; // Attack enemy

            if (enemy.hitPoints < 0) units.splice(units.indexOf(enemy), 1); // can splice in for loop?

        } else if (adjacents.includes('.')) {
            // Move
        }
    })
}

function getAdjacents(map, unit) {
    [t, tI] = getField(unit.x-1, unit.y);
    [b, tB] = getField(unit.x+1, unit.y);
    [l, tL] = getField(unit.x, unit.y-1);
    [r, tR] = getField(unit.x, unit.y+1);
    return [
        [t,l,r,b], // adjacents in reading order
        [tI,lI,rI,bI], // indices in reading order
    ];
}

function getField(x, y) {
    return [
        map[y][x],
        getUnitIndex(x, y),
    ];
}

function getEnemy(unit) {
    return unit.type === 'G' ? 'E' : 'G';
}

function getUnitIndex(x, y) {
    return units.indexOf(units.filter(el => el.x === x && el.y === y));
}

function readingOrder(a, b) {
    let valA = a.y * map[0].length + a.x;
    let valB = b.y * map[0].length + b.x;
    return 2*(valA > valB)-1;
}