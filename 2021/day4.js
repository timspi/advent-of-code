const data = require('fs').readFileSync('data/' + require('path').basename(__filename, '.js'), 'utf-8').split('\n\n');

const order = data.splice(0, 1)[0].split(',');
const boards = data.map(d => d.trim().split(/[ \n]+/g));

const rowcols_by_board = boards.map(_ => ({}));
const size = Math.sqrt(boards[0].length);

for (let num of order) {
    boards.forEach((b, i) => {
        const index = b.indexOf(num);
        if (index != -1) {
            b[index] = 'x';
            const row = Math.floor(index / size);
            const col = index % size;
            rowcols_by_board[i]['r' + row] = rowcols_by_board[i]['r' + row] ? rowcols_by_board[i]['r' + row] + 1 : 1;
            rowcols_by_board[i]['c' + col] = rowcols_by_board[i]['c' + col] ? rowcols_by_board[i]['c' + col] + 1 : 1;
        }
    });
    let winner;
    while ((winner = rowcols_by_board.findIndex(rowcols => Math.max(...Object.values(rowcols)) >= size)) >= 0) {
        const empty_fields = boards[winner].filter(f => f != 'x').map(Number).reduce((a, b) => a + b, 0);

        if (boards.length == 1 || boards.length == data.length) // output first and last winner
            console.log(num * empty_fields);

        boards.splice(winner, 1);
        rowcols_by_board.splice(winner, 1);

        if (boards.length === 0) break;
    }
}
