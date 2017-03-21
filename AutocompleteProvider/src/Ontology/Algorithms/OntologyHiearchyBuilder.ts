import { OntologyAssertions } from '../OntologyAssertions';
import { OntologyHiearchy, OntologyConcept } from '../OntologyHierchy';

var scc = require("strongly-connected-components")

interface IStronglyConnectedComponentAlgorithmResult {
    adjacencyList: number[][];
    components: number[][];
}

interface IStronglyConnectedComponentAlgorithm {
    compute(subclassOfEdges: { superClass: number, subsetClass: number }[], nodeCount: number): IStronglyConnectedComponentAlgorithmResult
}

class SccLibAlgorithmWrapper implements IStronglyConnectedComponentAlgorithm {
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

    compute(subclassEdges: { superClass: number, subsetClass: number }[], nodeCount: number): IStronglyConnectedComponentAlgorithmResult {
        var adjacencyList = this.convertEdgesToAdjacentList(subclassEdges, nodeCount);
        var res = scc(adjacencyList);
        return res;
    }
}

export class OntologyHiearchyBuilder {
    private stronglyConnectedComponentAlgorithm = new SccLibAlgorithmWrapper();

    public createOntologyHiearchy(graphAssertions: OntologyAssertions) {
        var strongComponentGraph = this.stronglyConnectedComponentAlgorithm.compute(graphAssertions.subClassEdges, graphAssertions.classes.length);
   
        var components = strongComponentGraph.components;
        var adjacencyList = strongComponentGraph.adjacencyList;

        var result = new OntologyHiearchy();

        for (var component of components) {
            var classesInCurrentComponent = component.map((x) => graphAssertions.classes[x]);
            result.addConcept(new OntologyConcept(classesInCurrentComponent));
        }

        for (var i = 0; i < adjacencyList.length; i++) {
            adjacencyList[i].forEach((x) => result.addSubclassOfEdge(i, x));
        }

        return result;
    }
}