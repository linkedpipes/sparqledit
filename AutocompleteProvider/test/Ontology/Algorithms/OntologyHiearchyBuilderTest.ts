import {OntologyAssertionsBuilder} from '../../../src/Ontology/Algorithms/OntologyAssertionBuilder';
import {TurtleGraphWrapper} from '../../../src/GraphTools/TurtleGraphWrapper';
import {AtomicClass, UnionClass} from '../../../src/Ontology/OntologyClass';
import {OntologyHiearchyBuilder} from '../../../src/Ontology/Algorithms/OntologyHiearchyBuilder';

import * as chai from 'chai';
import * as fs from 'fs';
var rdf = require('rdf');


function readFile(file: string) {
    var fileContent = fs.readFileSync(file).toString();
    return fileContent;
}

describe('GraphAlgoritm', () => {
    it('should load graph assertions.', () => {
        var ontologyAssertionsBuilder = new OntologyAssertionsBuilder();
        var graph = new TurtleGraphWrapper(fs.readFileSync(__dirname + '/resources/test.owl.ttl').toString());
        var graphAssertions = ontologyAssertionsBuilder.buildOntologyAsertions(graph)

        var cleverParentClass = new AtomicClass("http://example.org/test#CleverParent");
        var parentClass = new AtomicClass("http://example.org/test#Parent");

        var humanClass = new AtomicClass("http://example.org/test#Human");
        var humanUnionClass = (new UnionClass())
            .addClass(new AtomicClass("http://example.org/test#Woman"))
            .addClass(new AtomicClass("http://example.org/test#Man"));

        chai.expect(graphAssertions.existSubclassEdgeOntologyClass(cleverParentClass, parentClass)).to.be.true;
        chai.expect(graphAssertions.existSubclassEdgeOntologyClass(parentClass, cleverParentClass)).to.be.false;

        chai.expect(graphAssertions.existSubclassEdgeOntologyClass(humanClass, humanUnionClass)).to.be.true;
        chai.expect(graphAssertions.existSubclassEdgeOntologyClass(humanUnionClass, humanClass)).to.be.true;
    });

    it('should create strong components.', () => {
        // var groupsAlgorithm = new GroupsAlgorithm(fs.readFileSync(__dirname + '/ontologies/strongComponent.owl.ttl').toString());
        var graph = new TurtleGraphWrapper(fs.readFileSync(__dirname + '/resources/family.owl.ttl').toString());
        var ontologyAssertions = (new OntologyAssertionsBuilder()).buildOntologyAsertions(graph);
        var groupsAlgorithm = new OntologyHiearchyBuilder(ontologyAssertions);
        var result = groupsAlgorithm.compute();
        var fatherClass = new AtomicClass("http://example.org/test#Father");
        var index = result.getConceptContainsOntologyClass(fatherClass);
        var filtered = result.concepts.filter(x => x.ontologyClasses.length > 1);
    });
});