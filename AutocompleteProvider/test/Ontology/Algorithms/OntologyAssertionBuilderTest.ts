import { OntologyConcept } from '../../../src/Ontology/OntologyHierchy';
import { OntologyAssertionsBuilder } from '../../../src/Ontology/Algorithms/OntologyAssertionBuilder';
import { TurtleGraphWrapper } from '../../../src/GraphTools/TurtleGraphWrapper';
import { AtomicClass, UnionClass } from '../../../src/Ontology/OntologyClass';
import { OntologyHiearchyBuilder } from '../../../src/Ontology/Algorithms/OntologyHiearchyBuilder';

import * as chai from 'chai';
import * as fs from 'fs';


describe('OntologyAssertionBuilder', () => {
    it('should load assertions.', () => {
        var fileContent = fs.readFileSync(__dirname + "/resources/test.owl.ttl").toString();
        var graph = new TurtleGraphWrapper(fileContent);
        var ontologyAssertions = (new OntologyAssertionsBuilder()).buildOntologyAsertions(graph);

        var cleverParentClass = new AtomicClass("http://example.org/test#CleverParent");
        var parentClass = new AtomicClass("http://example.org/test#Parent");

        var humanClass = new AtomicClass("http://example.org/test#Human");
        var humanUnionClass = (new UnionClass())
            .addClass(new AtomicClass("http://example.org/test#Woman"))
            .addClass(new AtomicClass("http://example.org/test#Man"));

        chai.expect(ontologyAssertions.existSubclassEdgeOntologyClass(cleverParentClass, parentClass)).to.be.true;
        chai.expect(ontologyAssertions.existSubclassEdgeOntologyClass(parentClass, cleverParentClass)).to.be.false;

        chai.expect(ontologyAssertions.existSubclassEdgeOntologyClass(humanClass, humanUnionClass)).to.be.true;
        chai.expect(ontologyAssertions.existSubclassEdgeOntologyClass(humanUnionClass, humanClass)).to.be.true;
    });
});