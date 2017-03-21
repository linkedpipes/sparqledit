import { OntologyConcept } from '../../../src/Ontology/OntologyHierchy';
import { OntologyAssertionsBuilder } from '../../../src/Ontology/Algorithms/OntologyAssertionBuilder';
import { TurtleGraphWrapper } from '../../../src/GraphTools/TurtleGraphWrapper';
import { AtomicClass, UnionClass } from '../../../src/Ontology/OntologyClass';
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
});