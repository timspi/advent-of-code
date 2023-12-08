/**
 * Returns the GCD (greatest common divider) of two or more numbers.
 * 
 * @example gcd(4. 6)
 * > 2
 * 
 * @example gcd(4, 8, 48, 128))
 * > 4
 * 
 * @param numbers list of two or more numbers
 * @returns GCD
 */
export function gcd(a: number, b: number): number;
export function gcd(...numbers: number[]): number;
export function gcd(a: number, b: number, ...numbers: number[]) {
    for (const num of numbers) {
        b = gcd(b, num);
    }
    let r: number;
    while ((a % b) > 0) {
        r = a % b;
        a = b;
        b = r;
    }
    return b;
}

/**
 * Returns the LCM (least common multiple) of two or more numbers.
 * 
 * @example lcm(12, 7)
 * > 84
 * 
 * @example lcm(12, 15, 20)
 * > 60
 * 
 * @param numbers list of two or more numbers
 * @returns LCM
 */
export function lcm(a: number, b: number): number;
export function lcm(...numbers: number[]): number;
export function lcm(a: number, b: number, ...numbers: number[]) {
    for (const num of numbers) {
        b = lcm(b, num);
    }
    return a / gcd(a, b) * b;
}
