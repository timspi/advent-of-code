// Djikstra

export interface Graph {
    nodes: string[];
    edges: {
        from: string;
        to: string;
        weight: number;
    }[];
}

// export interface GraphMap extends Map<string, { to: string, weight: number }[]> {}
interface Edge { to: string, weight: number }
interface Node { edges: Edge[], distance: number, prev?: string };
interface GraphMapInternal extends Map<string, Node> { }


export function getShortestPath(graph: Graph, start: string, end: string) {
    const map = buildShortestDistanceTree(graph, start);
    const path = [end];
    let node: string = end;
    while (node !== start) {
        node = map.get(node)?.prev as string;
        path.push(node);

    }
    return { path: path.reverse(), weight: map.get(end)?.distance as number };
}

export function buildShortestDistanceTree(graph: Graph, start: string, terminateAt?: string) {
    let map: GraphMapInternal = new Map();

    for (const node of graph.nodes) {
        map.set(node, { distance: node === start ? 0 : Infinity, edges: [] });
    }
    for (const edge of graph.edges) {
        (map.get(edge.from) as Node).edges.push({ to: edge.to, weight: edge.weight });
    }

    let Q: string[] = graph.nodes;

    // if (graph instanceof Map) {
    //     map = graph as GraphMapInternal;
    //     Q = [...graph.keys()];
    // } else {
    //     map = new Map();
    //     for (const edge of graph.edges) {
    //         if (map.has(edge.from) {
    //             map.get(edge.from)?.push({ to: edge.to, weight: edge.weight } as Node);
    //         } else {
    //             map.set(edge.from, [{ to: edge.to, weight: edge.weight } as Node]);
    //         }
    //     }
    //     Q = graph.nodes;
    // }
    // // init
    // for (const [node, data] of map) {
    //     data.distance = Infinity;
    // }
    // const startNode = map.get(start);
    // if (!startNode) throw new Error('Could not find specified start node in graph!');
    // startNode.distance = 0;

    while (Q.length) {
        // find node in Q with smallest distance
        let min = { distance: Infinity } as Node;
        let minNodeStr: string = '';
        for (const nodeStr of Q) {
            const node = map.get(nodeStr);
            if (!node) throw new Error(`Could not find node "${nodeStr}" in graph!`);
            if (node.distance < min.distance) {
                min = node;
                minNodeStr = nodeStr;
            }
        }

        if (terminateAt === minNodeStr) return map;

        // remove from Q
        Q.splice(Q.findIndex(el => el === minNodeStr), 1);

        for (const edge of map.get(minNodeStr)?.edges || []) {
            if (Q.includes(edge.to)) {
                // update distance
                const altDist = (map.get(minNodeStr) as Node).distance + edge.weight;
                const to = map.get(edge.to) as Node;
                if (altDist < to.distance) {
                    to.distance = altDist;
                    to.prev = minNodeStr;
                }
            }
        }
    }

    return map;
}
