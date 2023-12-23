// Djikstra

import { assert } from "console";
import { Graph, getShortestPath } from "../shortest-path";

const graph: Graph = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
        { from: 'A', to: 'B', weight: 4 },
        { from: 'A', to: 'C', weight: 8 },
        { from: 'B', to: 'C', weight: 3 },
        { from: 'C', to: 'D', weight: 2 },
        { from: 'A', to: 'D', weight: 12 }
    ]
};

const { path, weight } = getShortestPath(graph, 'A', 'D')
assert(weight === 9, 'weight not correct');
assert(path.join() === 'A,B,C,D', 'path not correct');
