import {OntologyAssertions} from '../OntologyAssertions';
import {OntologyHiearchy, OntologyConcept} from '../OntologyHierchy';

var scc = require("strongly-connected-components")

interface IStrongComponentAlgorithmResult {
    adjacencyList: number[][];
    components: number[][];
}

interface IStrongComponentAlgorithm {
    compute(subclassEdges: { superClass: number, subsetClass: number }[], nodeCount: number): IStrongComponentAlgorithm
}

class SccLibAlgorithmWrapper implements IStrongComponentAlgorithm {
    private convertEdgesToAdjacentList(subclassEdges: { superClass: number, subsetClass: number }[], nodeCount: number) {
        var result: number[][] = new Array(nodeCount);
        for (var i = 0; i < nodeCount; i++) {
            result[i] = [];
        }
        for (var edge of subclassEdges) {
            result[edge.subsetClass].push(edge.superClass);
        }
        return result;
    }

    compute(subclassEdges: { superClass: number, subsetClass: number }[], nodeCount: number) {
        var adjacencyList = this.convertEdgesToAdjacentList(subclassEdges, nodeCount);
        var res = scc(adjacencyList);
        return res;
    }
}

export class OntologyHiearchyBuilder {
    private strongComponentAlgorithm = new SccLibAlgorithmWrapper();

    constructor(private graphAssertions: OntologyAssertions) {

    }

    public createComponentGraph(graphAssertions: OntologyAssertions) {

        var strongComponentGraph = this.strongComponentAlgorithm.compute(graphAssertions.subClassEdges, graphAssertions.classes.length);
        var adjacencyList: number[][] = strongComponentGraph.adjacencyList;
        var components: number[][] = strongComponentGraph.components;
        var result = new OntologyHiearchy();

        for (var component of components) {
            var classesInCurrentComponent = component.map((x) => graphAssertions.classes[x]);
            result.addConcept(new OntologyConcept(classesInCurrentComponent));
        }

        for (var i = 0; i < adjacencyList.length; i++) {
            adjacencyList[i].forEach((x) => result.addSubclassEdge(i, x));
        }

        return result;
    }

    public compute() {
        var componentGraph = this.createComponentGraph(this.graphAssertions);
        return componentGraph;
    }
}