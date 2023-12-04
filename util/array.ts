/**
 * Creates an arr with the specified length with increasing numbers starting at 1.
 * If the second parameter is set to a string or number, the arr will be filled with this value.
 * If the second parameter is a function, it is used to populate the arr.
 * 
 * @param length 
 * @param init optional, static value or generator function that takes the index
 * @returns initialized arr
 */
export function arr(length: number): number[];
export function arr<T>(length: number, init: ((i: number) => T)): T[];
export function arr<T>(length: number, init: T): T[];
export function arr(length: number, init?: any | ((i: number) => any)) {
    const isFunction = typeof init === 'function'
    if (init !== undefined && !isFunction) {
        return new Array(length).fill(init);
    }
    const out: any[] = []
    for (let i = 0; i < length; i++) {
        if (isFunction) out.push(init(i));
        else out.push(i + 1);
    }
    return out;
}
