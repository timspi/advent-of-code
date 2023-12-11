const round = (n: number, decimals?: number) => {
    if (decimals === undefined) return n;
    const pow = Math.pow(10, decimals);
    return Math.round(n * pow) / pow;
}

/**
 * TODO add JSDoc
 */
export class Vec {
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Converts the vector to a string.
     * 
     * @param decimals optional, round to the given number of decimals
     * @returns string representation of the vector
     */
    toString(decimals?: number) {
        return `(${round(this.x, decimals)},${round(this.y, decimals)})`;
    }

    toArray() {
        return [this.x, this.y];
    }

    toJSON() {
        return { x: this.x, y: this.y };
    }

    clone() {
        return new Vec(this.x, this.y);
    }

    equals(vec: Vec) {
        return this.x === vec.x && this.y === vec.y;
    }

    length() {
        if (this.x === 0) return this.y;
        if (this.y === 0) return this.x;
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    distance(vec: Vec) {
        const distance = this.clone().sub(vec);
        return distance.length();
    }

    manhattanDistance(vec: Vec) {
        const distance = this.clone().sub(vec);
        return Math.abs(distance.x) + Math.abs(distance.y);
    }

    add(vec: Vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    sub(vec: Vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }

    multiplyScalar(number: number) {
        this.x *= number;
        this.y *= number;
        return this;
    }

    divideScalar(number: number) {
        this.x /= number;
        this.y /= number;
        return this;
    }

    normalize() {
        this.divideScalar(this.length());
        return this;
    }

    dotProduct(vec: Vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    angle(vec: Vec) {
        return Math.acos(this.dotProduct(vec) / (this.length() * vec.length()));
    }

    angleDeg(vec: Vec) {
        return this.angle(vec) * 180 / Math.PI;
    }

    /**
     * Rotates the vector. For example (0,1) rotated by +90° will be (1,0).
     * Therefore, rotation is counter-clockwise in a regular coordinate system and clockwise on a map where +y is downward.
     * 
     * @param radians angle
     * @returns instance of the same rotated vector
     */
    rotate(radians: number) {
        const tmp = this.clone();
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        // Hack: Round to 15 decimals to avoid floating point errors.
        // This enables number comparisons with == at the cost of slightly reduced accuracy.
        // For our purposes, this "bad-practice" approach is more sensible.
        this.x = round(cos * tmp.x - sin * tmp.y, 15);
        this.y = round(sin * tmp.x + cos * tmp.y, 15);
        return this;
    }

    /**
     * Rotates the vector counter-clockwise.
     * 
     * @param degrees 
     * @returns instance of the same rotated vector
     */
    rotateDeg(degrees: number) {
        this.rotate(degrees / 180 * Math.PI);
        return this;
    }

    static add(v1: Vec, v2: Vec) {
        return v1.clone().add(v2);
    }
}
