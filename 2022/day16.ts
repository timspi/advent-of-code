import { Solver } from "./solver";

interface Valve {
    valve: string;
    flow: number;
    tunnels: string[];
    isOpen: boolean;
}
const solver = new Solver(data => {
    const valves: { [key: string]: Valve } = {};
    for (const line of data.split('\n')) {
        const [_, valve, flow, tunnels] = line.match(/Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z, ]+)/) || [];
        valves[valve] = { valve, flow: Number(flow), tunnels: tunnels.split(', '), isOpen: false };
    }
    Solver.log(valves);
    return valves;
});

solver.part1 = data => {
    const MAX_DURATION = 30;
    interface Path {
        pos: string;
        openedValves: string[];
        pressureRelease: number;
    }

    /**
     * Store hashes of states we have already examined.
     * The hash key should include the position and opened valves, the value the pressureRelease.
     */
    let max = 0;
    const cache: { [key: string]: number } = {};
    const hash = (path: Path) => `${path.pos}:${path.openedValves.join()}`;
    const add = (path: Path) => {
        const key = hash(path);
        if (cache[key] >= path.pressureRelease) return false;

        // Solver.log(`cache add: ${key} (${path.pressureRelease})`);
        cache[key] = path.pressureRelease;
        if (path.pressureRelease > max) max = path.pressureRelease;
        return true;
    };

    let paths: Path[] = [
        { pos: 'AA', openedValves: [], pressureRelease: 0 }
    ];
    add(paths[0]);

    for (let minute = 1; minute <= MAX_DURATION; minute++) {
        console.log(`Minute ${minute}, working on ${paths.length} different paths`);

        const nextPaths: Path[] = [];
        for (const path of paths) {
            const valve = data[path.pos];

            // try opening this valve
            if (valve.flow > 0 && !path.openedValves.includes(path.pos)) {
                const newPath: Path = {
                    pos: path.pos,

                    // add pos to opened valves
                    openedValves: [...path.openedValves, path.pos],

                    // calculate pressure that will be released in the remaining time
                    pressureRelease: path.pressureRelease + (MAX_DURATION - minute) * valve.flow,
                };

                const success = add(newPath);
                if (success) nextPaths.push(newPath);
            }

            // try going in the tunnels
            for (const next of valve.tunnels) {
                const newPath = { pos: next, openedValves: [...path.openedValves], pressureRelease: path.pressureRelease };
                const success = add(newPath);
                if (success) nextPaths.push(newPath);
            }
        }

        paths = nextPaths;
    }

    return max;
}

solver.part2 = data => {
    const MAX_DURATION = 26;
    interface Path {
        pos1: string;
        pos2: string;
        openedValves: string[];
        pressureRelease: number;
        ignore: string[];
    }

    // get total flow rate
    const totalFlowRate = Object.values(data).reduce((acc, valve) => acc + valve.flow, 0);
    const maxPressureRelease = totalFlowRate * MAX_DURATION;
    const estimatedPressureRelease = 0.38 * maxPressureRelease;
    Solver.log(totalFlowRate, maxPressureRelease, estimatedPressureRelease);

    /*
     * Store hashes of states we have already examined.
     * The hash key should include both positions and opened valves, the value the pressureRelease.
     * Which position is which does not matter, so sort them!
     */
    let max = 0;
    const cache: { [key: string]: number } = {};
    const hash = (path: Path) => {
        const pos = [path.pos1, path.pos2];
        pos.sort();
        return `${pos.join()}:${path.openedValves.join()}`;
    };
    const add = (path: Path) => {
        const key = hash(path);
        if (cache[key] >= path.pressureRelease) return false;

        cache[key] = path.pressureRelease;
        if (path.pressureRelease > max) max = path.pressureRelease;
        return true;
    };

    let paths: Path[] = [
        { pos1: 'AA', pos2: 'AA', openedValves: [], pressureRelease: 0, ignore: [] }
    ];
    add(paths[0]);

    // BFS
    for (let minute = 1; minute <= MAX_DURATION; minute++) {
        console.log(`Minute ${minute}, working on ${paths.length} different paths`);

        let nextPaths: Path[] = [];
        for (const path of paths) {
            // try opening both valves if different positions
            if (
                path.pos1 !== path.pos2 &&
                data[path.pos1].flow > 0 &&
                data[path.pos2].flow > 0 &&
                !path.openedValves.includes(path.pos1) &&
                !path.openedValves.includes(path.pos2)
            ) {
                const pressureRelease = (MAX_DURATION - minute) * (data[path.pos1].flow + data[path.pos2].flow);
                nextPaths.push({
                    pos1: path.pos1,
                    pos2: path.pos2,
                    openedValves: [...path.openedValves, path.pos1, path.pos2],
                    pressureRelease: path.pressureRelease + pressureRelease,
                    ignore: []
                });
            }

            // try opening pos1 valve, move pos2
            if (data[path.pos1].flow > 0 && !path.openedValves.includes(path.pos1)) {
                for (const next of data[path.pos2].tunnels) {
                    if (path.ignore.includes(next)) continue;

                    const pressureRelease = (MAX_DURATION - minute) * data[path.pos1].flow;
                    nextPaths.push({
                        pos1: path.pos1,
                        pos2: next,
                        openedValves: [...path.openedValves, path.pos1],
                        pressureRelease: path.pressureRelease + pressureRelease,
                        ignore: [path.pos2]
                    });
                }
            }

            // try opening pos2 valve, move pos1
            if (data[path.pos2].flow > 0 && !path.openedValves.includes(path.pos2)) {
                for (const next of data[path.pos1].tunnels) {
                    if (path.ignore.includes(next)) continue;

                    const pressureRelease = (MAX_DURATION - minute) * data[path.pos2].flow;
                    nextPaths.push({
                        pos1: next,
                        pos2: path.pos2,
                        openedValves: [...path.openedValves, path.pos2],
                        pressureRelease: path.pressureRelease + pressureRelease,
                        ignore: [path.pos1]
                    });
                }
            }

            // try moving pos1 and pos2
            for (const next1 of data[path.pos1].tunnels) {
                if (path.ignore.includes(next1)) continue;

                for (const next2 of data[path.pos2].tunnels) {
                    if (path.ignore.includes(next2)) continue;

                    const ignore = new Set(path.ignore);
                    ignore.add(path.pos1);
                    ignore.add(path.pos2);
                    nextPaths.push({
                        pos1: next1,
                        pos2: next2,
                        openedValves: [...path.openedValves],
                        pressureRelease: path.pressureRelease,
                        ignore: [...ignore]
                    });
                }
            }
        }

        // set paths for next round using cache to filter out all worse paths
        paths = nextPaths.filter(newPath => add(newPath));

        // only keep paths that can still reach the estimated goal
        paths = paths.filter(newPath => {
            const remainingValves = Object.values(data).filter(valve => valve.flow > 0 && !newPath.openedValves.includes(valve.valve));
            const remainingAvgFlowRate = remainingValves.reduce((acc, valve) => acc + valve.flow, 0) / remainingValves.length;
            const remainingPressureRelease = (MAX_DURATION - minute - 0.5 * remainingValves.length) * remainingAvgFlowRate * remainingValves.length;
            const pathPressureRelease = newPath.pressureRelease + remainingPressureRelease;
            const isAlive = pathPressureRelease > estimatedPressureRelease;

            // if (!isAlive) console.log(
            //     Math.round(remainingPressureRelease),
            //     Math.round(pathPressureRelease),
            //     Math.round(estimatedPressureRelease),
            //     isAlive ? '' : 'DEAD'
            // );

            return isAlive;
        });
    }

    return max;
}

solver.test(`Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`, 1651, 1707);

solver.run();
