/**
 * Run function fun for each pair of values in the array.
 * 
 * @example forEachPair([1, 2, 3], (a, b) => console.log(a, b))
 * > 1 2
 * > 1 3
 * > 2 3
 * 
 * @param arr 
 * @param fun 
 */
export function forEachPair<T = any>(arr: T[], fun: (el1: T, el2: T) => void) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            fun(arr[i], arr[j]);
        }
    }
}

/**
 * Run function fun for each pair of values in the array, including negatives.
 * 
 * @example forEachPairWithNegatives([1, 2, 3], (a, b) => console.log(a, b))
 * > 1 2
 * > 1 3
 * > 2 1
 * > 2 3
 * > 3 1
 * > 3 2
 * 
 * @param arr 
 * @param fun 
 */
export function forEachPairWithNegatives<T = any>(arr: T[], fun: (el1: T, el2: T) => void) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            if (i === j) continue;
            fun(arr[i], arr[j]);
        }
    }
}

/**
 * Run function fun for each permutation of the array.
 * 
 * @example forEachPermutation([1, 2, 3], permutation => console.log(permutation))
 * > [ 1, 2, 3 ]
 * > [ 2, 1, 3 ]
 * > [ 3, 1, 2 ]
 * > [ 1, 3, 2 ]
 * > [ 2, 3, 1 ]
 * > [ 3, 2, 1 ]
 * 
 * @param arr 
 * @param fun 
 */
export function forEachPermutation<T = any>(arr: T[], fun: (permutation: T[]) => void) {
    fun(arr); // call function with initial array

    let len = arr.length, i = 0;
    const c = arr.map(_ => 0);
    while (i < len) {
        if (c[i] < i) {
            if (i % 2 === 0) {
                swap(arr, 0, i);
            } else {
                swap(arr, c[i], i);
            }
            fun(arr); // call function with current permutation
            c[i]++;
            i = 0;
        } else {
            c[i] = 0;
            i++;
        }
    }

    function swap(arr: any[], i: number, j: number) {
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}