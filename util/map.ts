class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `${this.x},${this.y}`;
    }

    eq(other: Point) {
        return this.x === other.x && this.y === other.y;
    }
}

export class Dir extends Point {

    isDiagonal() {
        return this.x !== 0 && this.y !== 0;
    }

    getDirection() {
        if (this.isDiagonal()) throw new Error('Cannot use getDirection for diagonals!');

        if (this.x === 0 && this.y === 0) {
            return 's';
        }

        if (this.x === 0) {
            return this.y > 0 ? 'd' : 'u';
        } else {
            return this.x > 0 ? 'r' : 'l';
        }
    }

    turnLeft() {
        switch (this.getDirection()) {
            case 'd': return Dir.Right;
            case 'r': return Dir.Up;
            case 'u': return Dir.Left;
            case 'l': return Dir.Down;
            case 's': return Dir.Stop;
        }
    }

    turnRight() {
        switch (this.getDirection()) {
            case 'd': return Dir.Left;
            case 'r': return Dir.Down;
            case 'u': return Dir.Right;
            case 'l': return Dir.Up;
            case 's': return Dir.Stop;
        }
    }

    turnAround() {
        return new Dir(-this.x, -this.y);
    }

    static Stop = new Dir(0, 0);
    static Up = new Dir(0, -1);
    static Down = new Dir(0, 1);
    static Left = new Dir(-1, 0);
    static Right = new Dir(1, 0);
}

export class Pos extends Point {
    move(dir: Dir, times = 1) {
        return new Pos(this.x + times * dir.x, this.y + times * dir.y);
    }
}

export class Map<T> {
    map: T[][];
    width: number;
    height: number;

    constructor(mapStr: string, transform: (el: string) => T = (el: string) => (el as any)) {
        this.map = mapStr.split('\n').map(line => line.split('').map(transform));
        this.width = this.map[0].length;
        this.height = this.map.length;
    }

    has(pos: Pos) {
        return pos.x >= 0 && pos.y >= 0 && pos.x < this.width && pos.y < this.height;
    }

    startPos() {
        return new Pos(0, 0);
    }

    endPos() {
        return new Pos(this.width - 1, this.height - 1);
    }

    /**
     * Gets the element at the top left.
     */
    start() {
        return this.get(this.startPos());
    }

    /**
     * Gets the element at the bottom right.
     */
    end() {
        return this.get(this.endPos());
    }

    /**
     * Get element at specified pos. Throw an error if out of bounds.
     */
    at(pos: Pos) {
        if (!this.has(pos)) throw new Error(`Get element at invalid pos: ${pos.x},${pos.y}`);
        return this.map[pos.y][pos.x];
    }

    /**
     * Get element at specified pos. Return undefined if out of bounds.
     */
    get(pos: Pos) {
        return this.map[pos.y]?.[pos.x];
    }
}
