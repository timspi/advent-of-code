export type Map = { [coord: string]: string };

export function parseMapString(data: string, emptyTile = ' ', coordTransform = (row: number, col: number) => [col, row].join()) {
    const lines = data.split('\n').map(line => line.split(''));
    const map: Map = {};

    for (let r = 0; r < lines.length; r++) {
        for (let c = 0; c < lines[0].length; c++) {
            if (lines[r][c] !== emptyTile) {
                map[coordTransform(r, c)] = lines[r][c];
            }
        }
    }

    return map;
}

export function drawMap(map: Map, xCoord: false | number = false, yCoord: false | number = false, mathematicalYDirection = false) {
    const bounds = getMapBounds(map);

    const screen: string[][] = new Array(bounds.height).fill(0).map(() => new Array(bounds.width).fill(' '));
    for (let coords in map) {
        const [x, y] = coords.split(',').map(val => Number(val));
        const screenY = mathematicalYDirection ? bounds.maxY - y : y - bounds.minY;
        screen[screenY][x - bounds.minX] = map[coords];
    }

    let prefixLen = 0;
    if (yCoord !== false) {
        prefixLen = Math.max(String(bounds.minY).length, String(bounds.maxY).length);
    }

    let headerStr: string = '';
    if (xCoord !== false) {
        const headerLen = Math.max(String(bounds.minX).length, String(bounds.maxX).length);
        const header = new Array(headerLen).fill('');
        for (let x = bounds.minX; x <= bounds.maxX; x++) {
            const label = String(x).padStart(headerLen, ' ');
            for (let h = 0; h < headerLen; h++) {
                if (x % xCoord === 0) {
                    header[h] += label[h];
                } else {
                    header[h] += ' ';
                }
            }
        }
        headerStr = header.map(line => ''.padStart(prefixLen + 1, ' ') + line).join('\n') + '\n';
    }

    return headerStr + screen.map((line, i) => {
        if (yCoord !== false) {
            const label = mathematicalYDirection ? bounds.maxY - i : bounds.minY + i;
            const prefix = (label % yCoord === 0 ? `${label}` : '').padStart(prefixLen, ' ');
            return `${prefix} ${line.join('')}`;
        }
        return line.join('');
    }).join('\n');
}

export function getMapBounds(map: Map) {
    const coords = Object.keys(map).map(el => s2p(el));
    return getCoordsBounds(coords);

    const bounds = {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity,
        width: 0,
        height: 0
    };

    for (let coordStr of Object.keys(map)) {
        const [x, y] = coordStr.split(',').map(val => Number(val));
        if (x < bounds.minX) bounds.minX = x;
        if (x > bounds.maxX) bounds.maxX = x;
        if (y < bounds.minY) bounds.minY = y;
        if (y > bounds.maxY) bounds.maxY = y;
    }
    bounds.width = bounds.maxX - bounds.minX + 1;
    bounds.height = bounds.maxY - bounds.minY + 1;

    return bounds;
}

export function getCoordsBounds(coords: number[][]) {
    const bounds = {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity,
        width: 0,
        height: 0
    };

    for (const [x, y] of coords) {
        if (x < bounds.minX) bounds.minX = x;
        if (x > bounds.maxX) bounds.maxX = x;
        if (y < bounds.minY) bounds.minY = y;
        if (y > bounds.maxY) bounds.maxY = y;
    }
    bounds.width = bounds.maxX - bounds.minX + 1;
    bounds.height = bounds.maxY - bounds.minY + 1;

    return bounds;
}


export function add(pos: number[], dir: number[]) {
    return [pos[0] + dir[0], pos[1] + dir[1]];
}

export function sub(pos: number[], dir: number[]) {
    return [pos[0] - dir[0], pos[1] - dir[1]];
}

export function s2p(str: string): number[] {
    return str.split(',').map(el => Number(el));
}