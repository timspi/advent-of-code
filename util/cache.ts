
/**
 * Adds caching to any pure function.
 * 
 * @param fun function
 * @param hash optional, the default hash is constructed from all parameters with their toJSON or toString functions, concatenated with '|'
 * @returns the function with added caching
 */
export function runWithCache<P extends Array<any>, V = any>(fun: (...data: P) => V, hash?: (data: P) => string) {
    const cache = new Map<string, V>();
    return (...data: P) => {
        const key = hash ? hash(data) : data.map(param => param.toJSON ? param.toJSON() : param.toString()).join('|');
        if (cache.has(key)) return cache.get(key);
        const value = fun(...data);
        cache.set(key, value);
        return value;
    }
}


/**
 * Runs the given function until the returned hash value repeats or the number of cycles is reached.
 * If the hash value repeats, the function does not continue running but interpolates to the end and
 * returns the correct cache value that would be reached after the given amount of cycles.
 * 
 * @param cycles how often the function should be run
 * @param fun function that takes state as parameter and mutates the state in-place and returns a hash string that uniquely identifies the state
 * @param params the initial list of parameters that hold the state with which to call the function
 * @returns the interpolated result as the returned hash and if periodic, the periodicity
 */
export function runCycles<P extends any[]>(cycles: number, fun: (...params: P) => string, ...params: P): { hash: string, periodicity?: number } {
    const cache = new Map<string, number>();
    let cycle: number;
    let hash = '';

    // Run until one result occurs again
    for (cycle = 1; cycle <= cycles; cycle++) {
        hash = fun(...params);
        if (cache.has(hash)) break;
        cache.set(hash, cycle);
    }

    // Check if end -> no periodicity found
    if (cycle === cycles) return { hash };

    // Get previous cycle and calculate periodicity and the cycleIndex which holds the end result
    const previousCycle = cache.get(hash) || 0;
    const periodicity = cycle - previousCycle;
    const remainder = (cycles - cycle) % periodicity;
    const cycleIndex = previousCycle + remainder;

    // Find the hash of cycleIndex
    for (const [key, value] of cache.entries()) {
        if (value === cycleIndex) return { hash: key, periodicity };
    }

    throw new Error('missing result cycle index in cache'); // this should never happen
}
