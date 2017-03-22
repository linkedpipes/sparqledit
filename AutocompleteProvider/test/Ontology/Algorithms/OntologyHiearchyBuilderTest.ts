import {GetAllProps} from '../../../src/Ontology/Algorithms/GetAllProps';
import { MyGraph, orderTopologically } from '../../../src/Ontology/Algorithms/TopologyOrder';
import { OntologyConcept, OntologyHiearchy } from '../../../src/Ontology/OntologyHierchy';
import { OntologyAssertionsBuilder } from '../../../src/Ontology/Algorithms/OntologyAssertionBuilder';
import { TurtleGraphWrapper } from '../../../src/GraphTools/TurtleGraphWrapper';
import { AtomicClass } from '../../../src/Ontology/OntologyClass';
import { OntologyHiearchyBuilder } from '../../../src/Ontology/Algorithms/OntologyHiearchyBuilder';

import * as chai from 'chai';
import * as fs from 'fs';

function createOntologyAssertionsFrom(fileName: string) {
    var fileContent = fs.readFileSync(fileName).toString();
    var graph = new TurtleGraphWrapper(fileContent);
    var ontologyAssertions = (new OntologyAssertionsBuilder()).buildOntologyAsertions(graph);
    return ontologyAssertions;
}

describe('OntologyHiearchyBuilder', () => {
    it('should create ontology hiearchy which tests strongly connected components.', () => {
        var nodeAtomicClass = ((nodeNumber: number) => new AtomicClass("http://example.org/test#Node" + nodeNumber.toString()));
        var extractNodesIri = ((concept: OntologyConcept) => concept.ontologyClasses.map(x => (<AtomicClass>x).iri).sort());

        var ontologyAssertions = createOntologyAssertionsFrom(__dirname + '/resources/stronglyConnectedComponents.owl.ttl');

        var ontologyHiearchyBuilder = new OntologyHiearchyBuilder();
        var ontologyHiarchy = ontologyHiearchyBuilder.createOntologyHiearchy(ontologyAssertions);

        var node0Concept = ontologyHiarchy.getConceptContainsOntologyClass(nodeAtomicClass(0));
        var node5Concept = ontologyHiarchy.getConceptContainsOntologyClass(nodeAtomicClass(5));
        var node7Concept = ontologyHiarchy.getConceptContainsOntologyClass(nodeAtomicClass(7));

        chai.expect(ontologyHiarchy.concepts.length).equal(3);
        chai.expect(extractNodesIri(node0Concept)).deep
            .equal([nodeAtomicClass(0).iri,
            nodeAtomicClass(1).iri,
            nodeAtomicClass(2).iri,
            nodeAtomicClass(3).iri,
            nodeAtomicClass(4).iri]);
        chai.expect(extractNodesIri(node5Concept)).deep
            .equal([nodeAtomicClass(5).iri,
            nodeAtomicClass(6).iri]);

        chai.expect(extractNodesIri(node7Concept)).deep
            .equal([nodeAtomicClass(7).iri]);

        chai.expect(ontologyHiarchy.subClassOfEdges.length).equal(3);
        chai.expect(ontologyHiarchy.existsSubclassOfEdgeConcept(node0Concept, node5Concept)).to.be.true;
        chai.expect(ontologyHiarchy.existsSubclassOfEdgeConcept(node0Concept, node7Concept)).to.be.true;
        chai.expect(ontologyHiarchy.existsSubclassOfEdgeConcept(node5Concept, node7Concept)).to.be.true;
    })

    it('shold not do this', () => {
        function conceptMetric(concept: OntologyConcept, ontologyHiarchy: OntologyHiearchy) {

            var stateStack: { concept: OntologyConcept, depth: number }[] = [{ concept: concept, depth: 0 }];
            var visitedStates: { concept: OntologyConcept, depth: number }[] = [];

            while (stateStack.length > 0) {
                var currentConcept = stateStack.pop();
                visitedStates.push(currentConcept);
                var currentSuperClasses = ontologyHiarchy.getAllSuperClasses(currentConcept.concept);
                currentSuperClasses.forEach(x => stateStack.push({ concept: x, depth: currentConcept.depth + 1 }));
            }

            return {
                concept: concept,
                visitedStates: visitedStates,
                depth: visitedStates.reduce((acc, x) => Math.max(acc, x.depth), 0),
                conceptSize: concept.ontologyClasses.length,
                superClassCount: visitedStates.length - 1,
                reachableClassCount: visitedStates.reduce((acc, x) => acc + x.concept.ontologyClasses.length, 0)
            }
        }

        var ontologyAssertions = createOntologyAssertionsFrom(__dirname + "/../../ontologies/dbpedia.ttl");

        var ontologyHiearchyBuilder = new OntologyHiearchyBuilder();
        var ontologyHiarchy = ontologyHiearchyBuilder.createOntologyHiearchy(ontologyAssertions);
        var vice = ontologyHiarchy.concepts.filter(x => x.ontologyClasses.length > 1);

        var classIri = 'http://schema.org/Person';
        var getConcept = ontologyHiarchy.getConceptContainsOntologyClass(new AtomicClass(classIri));
        var superclasses = ontologyHiarchy.getAllSuperClasses(getConcept);

        var superclassMapping = ontologyHiarchy.concepts.map(x => ({
            subclass: x,
            superclasses: ontologyHiarchy.getAllSuperClasses(x)
        }));

        var superclassMappingsss = superclassMapping.filter(x => x.superclasses.length > 1);

        var metricMapping = ontologyHiarchy.concepts.map(x => conceptMetric(x, ontologyHiarchy));
        var sortesd = metricMapping.sort(x => -x.reachableClassCount).slice(0, 100);
        var sortesss = metricMapping.sort(x => -x.depth).slice(0, 100);

        var ne = '';
    });

    it('autocomplete order ', () => {
        var testIri = "http://dbpedia.org/ontology/SongWriter";
        var ontologyAssertions = createOntologyAssertionsFrom(__dirname + "/../../ontologies/dbpedia.ttl");

        var ontologyHiearchyBuilder = new OntologyHiearchyBuilder();
        var ontologyHiarchy = ontologyHiearchyBuilder.createOntologyHiearchy(ontologyAssertions);

        var testConcept = ontologyHiarchy.getConceptContainsOntologyClass(new AtomicClass(testIri));
        var propsAlg = new GetAllProps(ontologyHiarchy);

        var result = propsAlg.doAlgorithm(testConcept);
        var all = result.getAllPoperties();
        var chunk = result.getPropertiesByChunk();
        var ne = '';
    });

    it('shoud great topogorder', () => {
        var myGraph = new MyGraph();
        myGraph.allocateNode(7);
        myGraph.addEdge(0, 1);
        myGraph.addEdge(0, 2);
        myGraph.addEdge(0, 4);
        myGraph.addEdge(1, 3);
        myGraph.addEdge(2, 3);
        myGraph.addEdge(2, 5);
        myGraph.addEdge(3, 4);
        myGraph.addEdge(3, 5);
        myGraph.addEdge(5, 6);

        var order = orderTopologically(myGraph);
        chai.expect(order).to.deep.equal([0, 1, 2, 3, 4, 5, 6]);
    });
});