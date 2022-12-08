import { ROWS, Solver } from "./solver";

const solver = new Solver(ROWS);

solver.part1 = rows => {
    const trees = rows.map((row, y) => row.split('').map((height, x, arr) => ({
        height: Number(height),
        isVisible: x === 0 || x === arr.length - 1 || y === 0 || y === rows.length - 1,
        // isVisibleFromTop: y === 0,
        // isVisibleFromLeft: x === 0
    })));
    // const height = trees.length, width = trees[0].length;

    checkDirection(trees, false, false);
    checkDirection(trees, false, true);
    checkDirection(trees, true, false);
    checkDirection(trees, true, true);
    // for (let y = 1; y < height - 1; y++) {
    //     for (let x = 1; x < width - 1; x++) {
    //         for (let xt = x - 1; xt >= 0; xt--) {
    //             if (trees[y][xt].height >= trees[y][x].height) {
    //             }
    //         }
    //         let xt = x - 1;
    //         while (xt >= 0 && !trees[y][xt].isVisibleFromLeft) { xt--; }

    //         trees[y][x].isVisible = false;
    //     }
    // }
    // console.log(trees);
    return trees.map(row => row.filter(tree => tree.isVisible).length).reduce((a, b) => a + b);
};

function checkDirection(trees: { isVisible: boolean, height: number }[][], isHorizontal: boolean, isStart: boolean) {
    const viewPathLength = isHorizontal ? trees[0].length : trees.length;
    const sideLength = isHorizontal ? trees.length : trees[0].length;
    for (let side = 0; side < sideLength; side++) {
        let maxHeight = 0;
        for (let viewPath = 0; viewPath < viewPathLength; viewPath++) {
            const tree = isHorizontal ?
                (isStart ? trees[viewPath][side] : trees[trees.length - viewPath - 1][side]) :
                (isStart ? trees[side][viewPath] : trees[side][trees[0].length - viewPath - 1]);
            if (tree.height > maxHeight) {
                tree.isVisible = true;
                maxHeight = tree.height;
            }
        }
    }
}

solver.part2 = rows => {
    const trees = rows.map(row => row.split(''));

    let maxScore = 0;
    for (let y = 1; y < trees.length - 1; y++) {
        for (let x = 1; x < trees[0].length - 1; x++) {
            const tree = trees[y][x];
            let left = 0, right = 0, up = 0, down = 0;

            for (let xd = x - 1; xd >= 0; xd--) {
                // left
                left++;
                if (trees[y][xd] >= tree) break;
            }
            for (let xd = x + 1; xd < trees[0].length; xd++) {
                // right
                right++;
                if (trees[y][xd] >= tree) break;
            }
            for (let yd = y - 1; yd >= 0; yd--) {
                // up
                up++;
                if (trees[yd][x] >= tree) break;
            }
            for (let yd = y + 1; yd < trees.length; yd++) {
                // down
                down++;
                if (trees[yd][x] >= tree) break;
            }

            Solver.log(left, right, up, down);
            let score = left * right * up * down;
            if (score > maxScore) maxScore = score;
        }
    }

    return maxScore;
};

solver.test(`30373
25512
65332
33549
35390`, 21, 8)

solver.run();
