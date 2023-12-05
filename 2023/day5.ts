import { Solver } from "./solver";
import { matchNumbers } from "../util/split";

interface Range { from: number, to: number };
interface Mapping extends Range { offset: number };

const solver = new Solver(data => {
    const maps: Mapping[][] = [];
    const blocks = data.split('\n\n');
    const seeds = matchNumbers(blocks.splice(0, 1)[0]);
    for (const block of blocks) {
        const [title, ...mappings] = block.split('\n');
        const map: Mapping[] = [];
        for (const mapping of mappings) {
            const [destStart, srcStart, range] = matchNumbers(mapping);
            map.push({ from: srcStart, to: srcStart + range, offset: destStart - srcStart });
        }
        maps.push(map);
    }
    return { seeds, maps };
});

solver.part1 = ({ seeds, maps }) => {
    let ids = seeds;
    for (const map of maps) {
        ids = ids.map(id => {
            const mapping = map.find(mapping => id >= mapping.from && id < mapping.to);
            if (mapping) return id + mapping.offset;
            else return id;
        });
        Solver.log(ids);
    }
    return Math.min(...ids);
}

solver.part2 = ({ seeds, maps }) => {
    let ids: Range[] = [];
    for (let i = 0; i < seeds.length; i += 2) {
        const from = seeds[i];
        const to = from + seeds[i + 1];
        ids.push({ from, to });
    }

    for (const map of maps) {
        Solver.log(ids);

        const nextIds: Range[] = []
        for (const id of ids) {
            // find all intersection points of this id range with mappings
            const intersections = new Set<number>();
            intersections.add(id.from);
            intersections.add(id.to);
            for (const mapping of map) {
                // find all mapping borders in this id range
                if (mapping.from >= id.from && mapping.to < id.to) {
                    intersections.add(mapping.from);
                }
                if (mapping.to > id.from && mapping.to <= id.to) {
                    intersections.add(mapping.to);
                }
            }

            const sortedIntersections = [...intersections];
            sortedIntersections.sort((a, b) => a - b);
            Solver.log('intersections', sortedIntersections);

            // create new id ranges for each section in between any intersection points
            for (let i = 0; i < sortedIntersections.length - 1; i++) {
                const from = sortedIntersections[i], to = sortedIntersections[i + 1];
                const mapping = map.find(mapping => from >= mapping.from && to <= mapping.to);
                if (mapping) {
                    nextIds.push({ from: from + mapping.offset, to: to + mapping.offset });
                } else {
                    nextIds.push({ from, to });
                }
            }
        }
        ids = nextIds;
    }

    return Math.min(...ids.map(id => id.from));
}

solver.test(`seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`, 35, 46);

solver.run();
