import { IOntologyClass } from '../OntologyClass';
import { orderTopologically, MyGraph } from './TopologyOrder';
import { OntologyProperty, OntologyAssertions } from '../OntologyAssertions';
import { OntologyConcept, OntologyHiearchy } from '../OntologyHierchy';

import * as _ from 'lodash'

export class PropertyForConceptProvider {
    private ontologyAssertions: OntologyAssertions;

    constructor(private orderConcepts: OntologyConcept[], private ontologyHiearchy: OntologyHiearchy) {
        this.ontologyAssertions = this.ontologyHiearchy.ontologyAssertions;
    }

    getAllPoperties() {
        var result = _(this.orderConcepts)
            .map(x => this.getPropertiesOfConcept(x))
            .flatten<OntologyProperty>()
            .value();
        return result;
    }

    getPropertiesOfClass(ontologyClass: IOntologyClass) {
        return this.ontologyAssertions.findPropertiesByDomain(ontologyClass);
    }

    getPropertiesOfConcept(ontologyConcept: OntologyConcept) {
        var result = _(ontologyConcept.ontologyClasses)
            .map(x => this.getPropertiesOfClass(x))
            .flatten<OntologyProperty>()
            .value();

        return result;
    }
    
    getPropertiesByChunk() {
        return this.orderConcepts.map(x => ({ concept: x, properties: this.getPropertiesOfConcept(x) }))
    }
}

interface IReachabeConceptResult {
    root: OntologyConcept
    visitedStates: { concept: OntologyConcept, superClassConcept: OntologyConcept[] }[];
}
export class GetAllProps {

    constructor(private ontologyHiarchy: OntologyHiearchy) {

    }

    getAllReachableSuperClassesConcepts(concept: OntologyConcept): IReachabeConceptResult {
        var stateStack: OntologyConcept[] = [concept];
        var visitedStates: { concept: OntologyConcept, superClassConcept: OntologyConcept[] }[] = [];

        while (stateStack.length > 0) {
            var currentConcept = stateStack.pop();
            var currentSuperClasses = this.ontologyHiarchy.getAllSuperClasses(currentConcept);
            visitedStates.push({ concept: currentConcept, superClassConcept: currentSuperClasses });
            currentSuperClasses.forEach(concept => {
                if (!visitedStates.some(x => x.concept === concept)) {
                    stateStack.push(concept);
                }
            });
        }

        return {
            root: concept,
            visitedStates: visitedStates
        };
    }

    createAdjcencyList(input: IReachabeConceptResult) {
        var nodes = input.visitedStates.map((x, i) => ({ concept: x.concept, index: i, edges: [] }));
        var index = 0;
        for (var state of input.visitedStates) {
            nodes[index].edges = state.superClassConcept.map(x => {
                nodes.filter(y => y.concept == x)[0].index;
            });
            index++;
        }
        return nodes;
    }

    createMyGraphFromReachableConcepts(input: IReachabeConceptResult) {
        var myGraph = new MyGraph();
        myGraph.allocateNode(input.visitedStates.length);
        var conceptIndexMapping = input.visitedStates.map((x, i) => ({ concept: x.concept, index: i }));

        var index = 0;
        for (var state of input.visitedStates) {
            for (var superClassconcept of state.superClassConcept) {
                var conceptIndex = conceptIndexMapping.filter(y => y.concept == superClassconcept)[0].index;
                myGraph.addEdge(index, conceptIndex);
            }
            index++;
        }

        return myGraph;
    }

    doAlgorithm(concept: OntologyConcept) {
        var reachableConcepts = this.getAllReachableSuperClassesConcepts(concept);
        var graphOfConcepts = this.createMyGraphFromReachableConcepts(reachableConcepts);
        var order = orderTopologically(graphOfConcepts);
        var orderedConcepts = order.map(x => reachableConcepts.visitedStates[x].concept);
        return new PropertyForConceptProvider(orderedConcepts, this.ontologyHiarchy);
    }
}