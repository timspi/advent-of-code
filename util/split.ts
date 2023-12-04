/**
 * Split the input string data at all separators.
 * 
 * @example split('Hello: Foo | Bar', ': ', ' | ')
 * > [ 'Hello', 'Foo', 'Bar' ]
 * 
 * @param data 
 * @param separators 
 * @returns array of sections
 */
export function split(data: string, ...separators: string[]) {
    let rest = data;
    const out: string[] = [];
    for (const sep of separators) {
        const parts = rest.split(sep);
        if (parts.length > 1) out.push(...parts.slice(0, parts.length - 1));
        rest = parts[parts.length - 1];
    }
    if (rest) out.push(rest);
    return out;
}

/**
 * Match the input string data with the regular expression, return all matches as an array of strings.
 * 
 * @example match('abc123, foo: 42  |  bar  4!2', /\w+/g)
 * > [ 'abc123', 'foo', '42', 'bar', '4', '2' ]
 * 
 * @param data 
 * @param regexp 
 * @returns array of string matches
 */
export function match(data: string, regexp: RegExp) {
    return [...data.matchAll(regexp)].map(m => m[0]);
}

/**
 * Find all integers in the given string and return them in an array.
 * 
 * @example matchNumbers('1sa2ad3  foo 241   bar  4!2')
 * > [ 1, 2, 3, 241, 4, 2 ]
 * 
 * @param data a string with numbers separated by any charachter
 * @returns array of numbers
 */
export function matchNumbers(data: string) {
    return match(data, /\d+/g).map(el => Number(el));
}
