import { ROWS, Solver } from "./solver";

interface Blueprint {
    ore: { ore: number };
    clay: { ore: number };
    obsidian: { ore: number, clay: number };
    geode: { ore: number, obsidian: number };

    orePerGeode: number;
    clayPerGeode: number;
    clayRobotsPerOreRobot: number;
}
interface Types { ore: number, clay: number, obsidian: number, geode: number }

const solver = new Solver(ROWS);

solver.part1 = data => {
    const blueprints: Blueprint[] = [];

    for (const line of data) {
        const blueprint: any = {};
        const robots = line.matchAll(/Each (\w+) robot costs (\d+) ore( and (\d+) (\w+))?./g);
        for (const [_, type, oreCost, __, addCost, addType] of robots) {
            // console.log(type, oreCost, addCost, addType);
            blueprint[type] = { ore: Number(oreCost) };
            if (addCost) blueprint[type][addType] = Number(addCost);
        }

        blueprint.orePerGeode = blueprint.geode.ore + blueprint.geode.obsidian * blueprint.obsidian.ore;
        blueprint.clayPerGeode = blueprint.geode.obsidian * blueprint.obsidian.clay;
        blueprint.totalOrePerGeode = blueprint.orePerGeode + blueprint.clayPerGeode * blueprint.clay.ore;
        blueprint.clayRobotsPerOreRobot = blueprint.clayPerGeode / blueprint.orePerGeode;

        blueprints.push(blueprint as Blueprint);
    }

    // for (const costs of blueprints) {
    //     const totals: Types = {} as any;
    //     totals.ore = costs.ore.ore;
    //     totals.clay = totals.ore * costs.clay.ore;
    //     totals.obsidian = totals.ore * costs.obsidian.ore + totals.clay * costs.obsidian.clay;
    //     totals.geode = totals.ore * costs.clay.ore + totals.obsidian * costs.geode.obsidian;

    //     // Solver.log(totals);
    // }

    Solver.log(blueprints);

    let score = 0;
    for (const [i, blueprint] of blueprints.entries()) {
        // const geodeCount = simulate(blueprint, { ore: 1, clay: 0, obsidian: 0, geode: 0 }, { ore: 0, clay: 0, obsidian: 0, geode: 0 }, 1);
        const geodeCount = bfs(blueprint);
        console.log(geodeCount);
        score += (i + 1) * geodeCount;
    }

    return score;
};

const robotTypes: (keyof Types)[] = [
    'ore',
    'clay',
    'obsidian',
    'geode'
];
function simulate(costs: Blueprint, robots: Types, inventory: Types, minute: number): number {
    console.log(inventory);
    // create list of robots that can be build on current inventory
    const possibleRobots: (keyof Types)[] = [];
    for (const t of robotTypes) {
        if (Object.entries(costs[t]).every(([type, cost]) => inventory[type as keyof Types] >= cost)) {
            possibleRobots.push(t);
        }
    }

    // existing robots collect materials
    for (const t of robotTypes) {
        inventory[t] += robots[t];
    }

    if (minute === 24) return inventory.geode;

    // bruteforce:
    // const scores: number[] = [];
    // scores.push(simulate(costs, robots, inventory, minute + 1)); // don't build anything
    // for (const robot of possibleRobots) {
    //     const inv: Types = { ...inventory };
    //     Object.entries(costs[robot]).forEach(([type, cost]) => inv[type as keyof Types] -= cost);

    //     const robs: Types = { ...robots };
    //     robs[robot]++;

    //     scores.push(simulate(costs, robs, inv, minute + 1));
    // }
    // return Math.max(...scores);

    let robot: keyof Types | undefined = undefined;
    if (possibleRobots.includes('geode')) {
        robot = 'geode';
    } else if (
        possibleRobots.includes('obsidian') &&
        (() => {
            const remainingObsidian = costs.geode.obsidian - inventory.obsidian;
            const remainingOre = costs.geode.ore - inventory.ore;
            const minutesCurrent = Math.ceil(Math.max(remainingObsidian / robots.obsidian, remainingOre / robots.ore));
            const minutesWithAdditional = Math.ceil(Math.max(remainingObsidian / (robots.obsidian + 1), (remainingOre + costs.obsidian.ore) / robots.ore));
            // console.log(remainingClay, remainingOre, robots.clay, robots.ore);
            return minutesWithAdditional < minutesCurrent
        })()
    ) {
        robot = 'obsidian';
    } else if (
        possibleRobots.includes('clay') &&
        (() => {
            // if (robots.clay / robots.ore > costs.clayRobotsPerOreRobot) return false;
            const remainingClay = costs.obsidian.clay - inventory.clay;
            const remainingOre = costs.obsidian.ore - inventory.ore;
            const minutesCurrent = Math.ceil(Math.max(remainingClay / robots.clay, remainingOre / robots.ore));
            const minutesWithAdditional = Math.ceil(Math.max(remainingClay / (robots.clay + 1), (remainingOre + costs.clay.ore) / robots.ore));
            // console.log(remainingClay, remainingOre, robots.clay, robots.ore);
            return (minutesWithAdditional < minutesCurrent)
        })()
        // costs.obsidian.clay > inventory.clay &&
        // ((costs.obsidian.clay - inventory.clay) / robots.clay > (costs.obsidian.ore - inventory.ore) / robots.ore)
    ) {
        robot = 'clay';
    } else if (
        possibleRobots.includes('ore') &&
        (() => {
            const clayRobotsPerOreRobot = robots.clay / robots.ore;
            // console.log('clayRobotsPerOreRobot', clayRobotsPerOreRobot, costs.clayRobotsPerOreRobot);
            return clayRobotsPerOreRobot > costs.clayRobotsPerOreRobot;
        })()
    ) {
        robot = 'ore';
    }
    if (robot) {
        console.log(`Building ${robot} robot in minute ` + minute);
        const inv: Types = { ...inventory };
        Object.entries(costs[robot]).forEach(([type, cost]) => inv[type as keyof Types] -= cost);

        const robs: Types = { ...robots };
        robs[robot]++;

        return simulate(costs, robs, inv, minute + 1);
    }
    return simulate(costs, robots, inventory, minute + 1);
}

const cache: { [key: string]: number } = {};
const mapping: Types = {
    ore: 0,
    clay: 1,
    obsidian: 2,
    geode: 3
};
function bfs(costs: Blueprint): number {

    let options: number[][] = [[0, 0, 0, 0, 1, 0, 0, 0]];
    for (let minute = 1; minute <= 24; minute++) {
        const nextOptions: number[][] = [];

        for (const state of options) {
            cache[state.join()] = 1;
            let [numOre, numClay, numObs, numGeode, robotsOre, robotsClay, robotsObs, robotsGeode] = state;

            const possibleRobots: (keyof Types)[] = [];
            for (const t of robotTypes) {
                if (Object.entries(costs[t]).every(([type, cost]) => state[mapping[type as keyof Types]] >= cost)) {
                    possibleRobots.push(t);
                }
            }

            numOre += robotsOre;
            numClay += robotsClay;
            numObs += robotsObs;
            numGeode += robotsGeode;

            // don't do anything
            nextOptions.push([numOre, numClay, numObs, numGeode, robotsOre, robotsClay, robotsObs, robotsGeode]);

            for (const robot of possibleRobots) {
                switch (robot) {
                    case 'ore': nextOptions.push([numOre - costs.ore.ore, numClay, numObs, numGeode, robotsOre + 1, robotsClay, robotsObs, robotsGeode]); break;
                    case 'clay': nextOptions.push([numOre - costs.clay.ore, numClay, numObs, numGeode, robotsOre, robotsClay + 1, robotsObs, robotsGeode]); break;
                    case 'obsidian': nextOptions.push([numOre - costs.obsidian.ore, numClay - costs.obsidian.clay, numObs, numGeode, robotsOre, robotsClay, robotsObs + 1, robotsGeode]); break;
                    case 'geode': nextOptions.push([numOre - costs.geode.ore, numClay, numObs - costs.geode.obsidian, numGeode, robotsOre, robotsClay, robotsObs, robotsGeode + 1]); break;
                }
            }
        }

        options = nextOptions.filter(opt => {
            if (cache[opt.join()]) return false;
            if (opt[4] > Math.max(costs.ore.ore, costs.clay.ore, costs.obsidian.ore, costs.geode.ore)) return false;
            if (opt[5] > costs.obsidian.clay) return false;
            if (opt[6] > costs.geode.obsidian) return false;
            return true;
        });
    }

    return Math.max(...options.map(opt => opt[3]));
}

solver.test(`Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`, 33)

solver.run();
