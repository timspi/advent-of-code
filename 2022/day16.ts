import { Solver } from "./solver";
import { forEachPairWithNegatives, forEachPermutation } from "./util/for-each";

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
    // Solver.log(valves);
    return valves;
});

solver.part1 = data => {

    // extract all valves that are useful (flow>0)
    const valves = Object.values(data).filter(v => v.flow > 0);
    // Solver.log(valves.length);

    // find shortest paths between all useful nodes

    // --> build a tree
    // const distances: { [key: string]: number } = {}; // e.g. AA,CC: 2 hops
    // for (let valve of Object.values(data)) {
    //     for (let dst of valve.tunnels) {
    //         distances[[valve, dst].join()] = 1;
    //     }
    // }
    const shortestPaths: { [key: string]: Valve[] } = {};
    forEachPairWithNegatives([...valves, data['AA']], (a, b) => {
        const path = findPath([a], b);
        const index = `${a.valve},${b.valve}`;
        // Solver.log(`found path ${index} with length ` + path.length);
        shortestPaths[index] = path;
    });
    function findPath(path: Valve[], dst: Valve) {
        const options: Valve[][] = [];
        for (const next of path[path.length - 1].tunnels) {
            if (next === dst.valve) return [...path, data[next]];

            if (!path.map(p => p.valve).includes(next)) {
                const opt = findPath([...path, data[next]], dst);
                if (opt) options.push(opt);
            }
        }
        options.sort((a, b) => a.length - b.length);
        return options[0];
    }

    // console.log(Object.keys(shortestPaths).length);
    console.log(Object.values(shortestPaths).filter(p => p[0].valve === 'AA').map(path => [path.map(v => v.valve).join(), path.length]));

    // then, just try (all?) different opening orders
    let max = 0;
    // forEachPermutation(valves, path => {
    //     const releasedPressure = evaluatePath(path);
    //     if (releasedPressure > max) max = releasedPressure;
    // });
    // NO, input has 15 viable valves, that's 1,307,674,368,000 possibilites

    // let pos = data['AA'];
    // let remainingRounds = 30;
    // while(true) {
    //     // calculate releasedPressure for each remaining valve from here and choose max
    //     const scores = pos.tunnels.map(next => getScore(pos, data[next], remainingRounds)) // pos.tunnels is all valves, not only viables ones -> does not work
    //     const max = Math.max(...scores);
    //     const index = scores.findIndex(score => score === max);
    //     pos = data[pos.tunnels]
    // }


    function evaluatePath(path: Valve[]) {
        let last = 'AA';
        let roundsRemaining = 30;
        let releasedPressure = 0;
        for (const valve of path) {
            roundsRemaining -= shortestPaths[[last, valve.valve].join()].length;
            if (roundsRemaining <= 0) break;
            releasedPressure += roundsRemaining * valve.flow;
            last = valve.valve;
        }
        return releasedPressure;
    }

    function getScore(from: Valve, to: Valve, roundsRemaining: number) {
        roundsRemaining -= shortestPaths[[from.valve, to.valve].join()].length;
        if (roundsRemaining <= 0) return 0;
        return roundsRemaining * to.flow;
    }

    // let counter = 0;
    // simulate(data['AA'], valves, 0, 30);
    // function simulate(valve: Valve, remainingValves: Valve[], releasedPressure: number, roundsRemaining: number) {
    //     // Solver.log('simulate', valve.valve, remainingValves.map(v => v.valve), releasedPressure, roundsRemaining);
    //     if (roundsRemaining <= 0 || remainingValves.length === 0) {
    //         Solver.log(`releasedPressure is ${releasedPressure}\n`);
    //         counter++;
    //         if (counter > 100) process.exit();
    //         return releasedPressure;
    //     }

    //     let max = 0;
    //     if (valve.flow > 0 && remainingValves.find(v => v.valve === valve.valve)) {
    //         // open valve
    //         const totalReleaseOfValve = roundsRemaining * valve.flow;
    //         Solver.log('opening valve', valve.valve, totalReleaseOfValve);
    //         const res = simulate(valve, remainingValves.filter(v => v.valve !== valve.valve), releasedPressure + totalReleaseOfValve, roundsRemaining - 1);
    //         if (res > max) max = res;
    //     }

    //     for (const next of remainingValves) {
    //         if (next.valve === valve.valve) continue;
    //         // go there next
    //         Solver.log(`going to valve ${next.valve} (from ${valve.valve})`);
    //         const res = simulate(next, remainingValves, releasedPressure, roundsRemaining - distances[`${valve.valve},${next.valve}`]);
    //         if (res > max) max = res;
    //     }

    //     return max;
    // }

    return max;

    // type Option = { valve: string, openValves: string[], releasePerMinute: number, release: number };
    // let options: Option[] = [{ valve: 'AA', openValves: [], releasePerMinute: 0, release: 0 }];
    // const cache: string[] = [];
    // for (let round = 1; round <= 30; round++) {
    //     const nextOptions: Option[] = [];
    //     for (let { valve, openValves, releasePerMinute, release } of options) {
    //         cache.push(valve + release);
    //         release += releasePerMinute;

    //         // open valve
    //         if (!openValves.includes(valve) && data[valve].flow > 0) {
    //             nextOptions.push({
    //                 valve,
    //                 openValves: [...openValves, valve],
    //                 releasePerMinute: releasePerMinute + data[valve].flow,
    //                 release
    //             });
    //         }

    //         // try all tunnels
    //         for (let nextValve of data[valve].tunnels) {
    //             // check if better option already exists
    //             // if (!options.find(opt => opt.release > release && opt.openValves.every(v => openValves.includes(v)))) {
    //             // check if duplicate                    
    //             if (!nextOptions.find(opt => opt.valve === valve && opt.release <= release && opt.openValves.length >= openValves.length) && !cache.includes(nextValve + release)) {
    //                 nextOptions.push({
    //                     valve: nextValve,
    //                     openValves,
    //                     releasePerMinute,
    //                     release
    //                 });
    //             }
    //         }
    //     }
    //     options = nextOptions;
    //     // console.log('After round ' + round);
    //     // console.log(options);
    // }
    // // console.log(options);
    // // simulate(data, 'AA', [], 0, 0, 30);
    // return Math.max(...options.map(opt => opt.release));
}

// const cache: { [key: string]: number } = {};
// function simulate(data: { [key: string]: Valve }, valve: string, openValves: string[], releasePerMinute: number, releasedPressure: number, remainingTime: number): number {
//     if (remainingTime === 0) {
//         // console.log(openValves, releasedPressure);
//         return releasedPressure;
//     }
//     if (cache[openValves.join()])

//         releasedPressure += releasePerMinute;

//     // try out all options
//     let max = 0;

//     // open valve
//     if (!openValves.includes(valve) && data[valve].flow > 0) {
//         releasePerMinute += data[valve].flow;
//         const res = simulate(data, valve, [...openValves, valve], releasePerMinute, releasedPressure, remainingTime - 1);
//         if (res > max) max = res;
//     }

//     // try all tunnels
//     for (let nextValve of data[valve].tunnels) {
//         const res = simulate(data, nextValve, openValves, releasePerMinute, releasedPressure, remainingTime - 1);
//         if (res > max) max = res;
//     }

//     return max;
// }

solver.test(`Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`, 1651);

solver.run();
