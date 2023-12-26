
export interface Bounds {
    maxX: number;
    maxY: number;
    minX: number;
    minY: number;
}

export class Field<T extends string = string> {
    private map: Map<string, T>;
    private bounds: Bounds;
    private boundsOutOfSync = false;

    constructor() {
        this.map = new Map();
        this.bounds = this.getDefaultBounds();
    }

    private getDefaultBounds(): Bounds {
        return {
            maxX: -Infinity,
            maxY: -Infinity,
            minX: Infinity,
            minY: Infinity,
        };
    }

    private xy2k(x: number, y: number) {
        return `${x},${y}`;
    }

    private k2xy(key: string) {
        return key.split(',').map(el => Number(el)) as [number, number];
    }

    clone() {
        const cloned = new Field();
        cloned.map = new Map<string, T>(this.map.entries());
        cloned.bounds = { ...this.bounds };
        return cloned;
    }

    set(x: number, y: number, value: T) {
        this.updateBoundsSetValue(x, y);
        this.map.set(this.xy2k(x, y), value);
    }

    parseMapString(data: string, ignoreChars = ['.'], transform: (el: string) => T = (el => el as T)) {
        const arr = data.split('\n');
        for (let y = 0; y < arr.length; y++) {
            for (let x = 0; x < arr[y].length; x++) {
                const char = arr[y][x];
                if (!ignoreChars.includes(char)) {
                    this.set(x, y, transform(char));
                }
            }
        }
    }

    private updateBoundsSetValue(x: number, y: number) {
        if (x < this.bounds.minX) this.bounds.minX = x;
        if (x > this.bounds.maxX) this.bounds.maxX = x;
        if (y < this.bounds.minY) this.bounds.minY = y;
        if (y > this.bounds.maxY) this.bounds.maxY = y;
    }

    has(x: number, y: number) {
        return this.map.has(this.xy2k(x, y));
    }

    get(x: number, y: number) {
        return this.map.get(this.xy2k(x, y));
    }

    clear() {
        this.bounds = this.getDefaultBounds();
        this.map.clear();
    }

    delete(x: number, y: number) {
        this.boundsOutOfSync = true;
        return this.map.delete(this.xy2k(x, y));
    }

    fillSpace(startX: number, startY: number, el: T) {
        const bounds = this.getBounds();
        const stack = [[startX, startY]];
        while (stack.length) {
            const [x, y] = stack.pop() as number[];
            if (x < bounds.minX || x > bounds.maxX || y < bounds.minY || y > bounds.maxY) {
                throw new Error(`Area not contained! Left at ${x},${y}.`);
            }

            this.set(x, y, el);

            if (!this.has(x - 1, y)) stack.push([x - 1, y]);
            if (!this.has(x + 1, y)) stack.push([x + 1, y]);
            if (!this.has(x, y - 1)) stack.push([x, y - 1]);
            if (!this.has(x, y + 1)) stack.push([x, y + 1]);
        }
    }

    getBounds() {
        if (this.boundsOutOfSync) {
            // Recalculate bounds
            this.bounds = this.getDefaultBounds();
            for (const key of this.map.keys()) {
                const [x, y] = this.k2xy(key);
                this.updateBoundsSetValue(x, y);
            }
            this.boundsOutOfSync = false;
        }
        return this.bounds;
    }

    /**
     * Returns the width of the field.
     * If the field has no entries, returns -Infinity.
     * 
     * @returns total width that encompasses all entries
     */
    getWidth() {
        const bounds = this.getBounds();
        return bounds.maxX - bounds.minX + 1; // + 1 to include both the max and min value
    }

    /**
     * Returns the height of the field.
     * If the field has no entries, returns -Infinity.
     * 
     * @returns total height that encompasses all entries
     */
    getHeight() {
        const bounds = this.getBounds();
        return bounds.maxY - bounds.minY + 1; // + 1 to include both the max and min value
    }

    /**
     * Returns all entries as an array of [x, y, value] elements.
     * 
     * @returns Array<[x, y, value]>
     */
    getEntries() {
        const out: [number, number, T][] = [];
        for (const entry of this.map.entries()) {
            const [x, y] = this.k2xy(entry[0]);
            out.push([x, y, entry[1]]);
        }
        return out;
    }

    /**
     * Returns all entries in the given row as an array of [x, y, value] elements.
     * 
     * @param rowY the row index
     * @returns Array<[x, y, value]>
     */
    getRow(rowY: number) {
        const out: [number, number, T][] = [];
        for (const entry of this.map.entries()) {
            const [x, y] = this.k2xy(entry[0]);
            if (y === rowY) out.push([x, y, entry[1]]);
        }
        return out;
    }

    /**
     * Returns all entries in the given column as an array of [x, y, value] elements.
     * 
     * @param colX the column index
     * @returns Array<[x, y, value]>
     */
    getCol(colX: number) {
        const out: [number, number, T][] = [];
        for (const entry of this.map.entries()) {
            const [x, y] = this.k2xy(entry[0]);
            if (x === colX) out.push([x, y, entry[1]]);
        }
        return out;
    }


    /**
     * Returns a string representation of the map as a '|' seperated list of 'x,y:value' entries.
     * 
     * @returns string
     */
    toString() {
        let out: string[] = [];
        for (const [key, val] of this.map.entries()) {
            out.push(`${key}:${val}`);
        }
        return out.join('|');
    }

    /**
     * Returns the map as a plain object with coordinates as key in the format 'x,y' and the value as value.
     * 
     * @returns object
     */
    toJSON() {
        return Object.fromEntries(this.map.entries());
    }

    /**
     * Returns a string to visualize the map on a screen.
     * 
     * @param xCoord enable x coordinates, the value is the step interval
     * @param yCoord enable y coordinates, the value is the step interval
     * @param mathematicalYDirection print so that +y is upward instead of downward 
     * @param transform transform function to convert the value to a single charachter that is displayed on the map
     * @returns string representation of the map
     */
    toMapString(xCoord: false | number = false, yCoord: false | number = false, mathematicalYDirection = false, transform: (el: T) => string = el => String(el).charAt(0)) {
        const bounds = this.getBounds();

        const screen: string[][] = new Array(this.getHeight()).fill(0).map(() => new Array(this.getWidth()).fill(' '));
        for (let entry of this.map.entries()) {
            const [x, y] = this.k2xy(entry[0]);
            const screenY = mathematicalYDirection ? bounds.maxY - y : y - bounds.minY;
            screen[screenY][x - bounds.minX] = transform(entry[1]);
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
}
