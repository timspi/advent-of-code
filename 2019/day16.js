
// PART 1

let data = '59717238168580010599012527510943149347930742822899638247083005855483867484356055489419913512721095561655265107745972739464268846374728393507509840854109803718802780543298141398644955506149914796775885246602123746866223528356493012136152974218720542297275145465188153752865061822191530129420866198952553101979463026278788735726652297857883278524565751999458902550203666358043355816162788135488915722989560163456057551268306318085020948544474108340969874943659788076333934419729831896081431886621996610143785624166789772013707177940150230042563041915624525900826097730790562543352690091653041839771125119162154625459654861922989186784414455453132011498';

function part1(data) {
    for (let i = 0; i < 100; i++) {
        data = fft_phase(data);
    }
    console.log(data.substr(0, 8));
}

function fft_phase(input) {
    input = input.split('');
    let output = '';
    for (let count = 1; count <= input.length; count++) {
        let pattern = getPattern(input.length, count);
        output += lastDigit(input.map((val, i) => val*pattern[i]).reduce((a, b) => a + b));
    }
    return output;
}

function lastDigit(num) {
    return Math.abs(num) % 10;
}

// Count starts at 1 for first element
function getPattern(len, count) {
    let base = [0, 1, 0, -1];
    let pattern = [];
    for (let i = 0; i <= len; i++) { // <= because shift at end
        pattern.push(base[ Math.floor(i / count) % 4 ]);
    }
    return pattern.slice(1);
}


// PART 2

/*
starting in the middle of the output, the n output digits from the right are only dependent
on the n input digits from the right
*/

// part2('03036732577212944063491565474664');
part2(data);
function part2(data) {

    let full_data = repeat(data, 10000);

    let offset = data.substr(0, 7) - 0;
    if (offset <= full_data.length / 2) throw new Error('Offset in first half of signal is not supported');

    let relevant_input = full_data.substr(offset).split('').map(el => el - 0);

    let start = Date.now();

    for (let i = 0; i < 100; i++) {
        fft_phase_right(relevant_input);
    }
    console.log(relevant_input.slice(0, 8).join(''));
    console.log('duration (ms): ' + (Date.now() - start));
}

function fft_phase_right(input) {
    for (let i = input.length - 1; i > 0; i--) {
        input[i - 1] = lastDigit(input[i - 1] + input[i]);
    }
    return input;
}

function repeat(value, times) {
    let out = '';
    for (let i = 0; i < times; i++) {
        out += value;
    }
    return out;
}
