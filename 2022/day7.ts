import { Solver } from "./solver";

const solver = new Solver(data => {
    const lines = data.split('\n');

    let path: string[] = ['root'];
    const files: { [key: string]: { file: string, size: number }[] & { size: number } } = {};

    files['root'] = [] as any;
    files['root'].size = 0;

    for (const line of lines) {
        if (line.startsWith('$')) {
            const [_, cmd, arg] = line.split(' ');
            if (cmd === 'cd') {
                if (arg === '/') {
                    path = ['root'];
                } else if (arg === '..') {
                    path.pop();
                } else {
                    path.push(arg);
                }
            }
        } else {
            const [sizeOrDir, file] = line.split(' ');
            if (sizeOrDir === 'dir') {
                const dir = [...path, file].join('/');
                files[dir] = [] as any;
                files[dir].size = 0;
            } else {
                const size = Number(sizeOrDir);
                const dir = path.join('/');
                // console.log('putting file in ' + dir);
                files[dir].push({ file, size });
                for (let i = 1; i <= path.length; i++) {
                    files[path.slice(0, i).join('/')].size += size;
                }
            }
        }
    }
    return Object.values(files).map(dir => dir.size);
});

solver.part1 = fileSizes => fileSizes.filter(size => size <= 100000).reduce((a, b) => a + b);

solver.part2 = fileSizes => {
    const unusedSpace = 70000000 - fileSizes[0];
    const spaceNeeded = 30000000 - unusedSpace;

    fileSizes.sort((a, b) => a - b);

    let size = 0;
    for (let i = 0; i < fileSizes.length; i++) {
        size = fileSizes[i];
        if (size >= spaceNeeded) break;
    }

    return size;
};

solver.test(`$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`, 95437, 24933642);

solver.run();
