import { OntologyConcept, OntologyHiearchy } from '../OntologyHierchy';

enum NodeState {
    Fresh,
    Opened,
    Closed
}

export function orderTopologically(graph: MyGraph) {
    var roots = [];
    for (var i = 0; i < graph.nodeCount; i++) {
        if (graph.getNodeOutEdges(i).length == 0) {
            roots.push(i);
        }
    }

    var invetedGraph = graph.getInvertedGraph(); //vytvor opacne orientovany graf
    var nodeStates: NodeState[] = [];

    for (var i = 0; i < graph.nodeCount; i++) {
        nodeStates.push(NodeState.Fresh);
    }

    var order: number[] = [];
    for (var root of roots) {
        orderingStep(invetedGraph, root, nodeStates, order);
    }
    return order;
}

function orderingStep(graph: MyGraph, currentNode: number, nodeStates: NodeState[], order: number[]) {
    nodeStates[currentNode] = NodeState.Opened;
    for (var i of graph.getNodeOutEdges(currentNode)) {
        if (nodeStates[i] == NodeState.Fresh) {
            orderingStep(graph, i, nodeStates, order);
        }
        else if (nodeStates[i] == NodeState.Opened) {
            throw new Error("Graph contains cycles.");
        }
    }
    order.push(currentNode);
    nodeStates[currentNode] = NodeState.Closed;
}

export class MyGraph {
    private _nodeCount: number = 0;

    private outNodeEdges: number[][] = [];

    private inNodeEdges: number[][] = [];

    private addEdgeToTable(table: number[][], sourceNode: number, destinationNode: number) {
        var edgesOfSourceNode = table[sourceNode];
        if (!edgesOfSourceNode.some(x => x == destinationNode)) {
            edgesOfSourceNode.push(destinationNode);
        }
    }

    public get nodeCount() {
        return this._nodeCount;
    }

    public allocateNode(nodeCount: number) {
        this._nodeCount += nodeCount;

        for (var i = 0; i < nodeCount; i++) {
            this.outNodeEdges.push([]);
            this.inNodeEdges.push([]);
        }
    }

    public getNodeOutEdges(nodeIndex: number) {
        return this.outNodeEdges[nodeIndex];
    }

    public getNodeInEdges(nodeIndex: number) {
        return this.inNodeEdges[nodeIndex];
    }

    public addEdge(sourceNode: number, destinationNode: number) {
        if (sourceNode >= this.nodeCount || destinationNode >= this.nodeCount) {
            throw Error("At least one node in edge is invalid.");
        }
        this.addEdgeToTable(this.outNodeEdges, sourceNode, destinationNode);
        this.addEdgeToTable(this.inNodeEdges, destinationNode, sourceNode);
    }

    public getInvertedGraph() {
        var inverseGraph = new MyGraph();
        inverseGraph._nodeCount = this._nodeCount;
        inverseGraph.inNodeEdges = this.outNodeEdges;
        inverseGraph.outNodeEdges = this.inNodeEdges;
        return inverseGraph;
    }
}