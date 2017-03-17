import { OntologyAssertions } from '../../src/Ontology/OntologyAssertions';
import { AtomicClass } from '../../src/Ontology/OntologyClass';

import * as chai from 'chai';
import * as fs from 'fs';

describe('OntologyAssertions', () => {
    it('should correctlly work with classes.', () => {
        var ontologyAssertions = new OntologyAssertions();
        var c1 = new AtomicClass('http://example.org/c1');
        var c2 = new AtomicClass('http://example.org/c2');

        ontologyAssertions.addClassOrGetIndex(c1);
        chai.expect(ontologyAssertions.findClass(c1)).to.equal(0);
        chai.expect(ontologyAssertions.findClass(c2)).to.equal(-1);

        ontologyAssertions.addClassOrGetIndex(c2);
        chai.expect(ontologyAssertions.findClass(c1)).to.equal(0);
        chai.expect(ontologyAssertions.findClass(c2)).to.equal(1);

        var c1Index = ontologyAssertions.addClassOrGetIndex(c2);
        chai.expect(c1Index).to.equal(1);
        chai.expect(ontologyAssertions.findClass(c1)).to.equal(0);
        chai.expect(ontologyAssertions.findClass(c2)).to.equal(1);
    });

    it('should correctlly work with subClasses.', () => {
        var ontologyAssertions = new OntologyAssertions();
        var c1 = new AtomicClass('http://example.org/c1');
        var c2 = new AtomicClass('http://example.org/c2');
        var c3 = new AtomicClass('http://example.org/c2');
        var c4 = new AtomicClass('http://example.org/c4');

        ontologyAssertions.addSubclassEdge(c1, c2);
        chai.expect(ontologyAssertions.existSubclassEdge(0, 1)).to.be.true;
        chai.expect(ontologyAssertions.existSubclassEdgeOntologyClass(c1, c2)).to.be.true;
        chai.expect(ontologyAssertions.existSubclassEdgeOntologyClass(c2, c3)).to.be.false;
        chai.expect(ontologyAssertions.existSubclassEdge(0, 2)).to.be.false;

        ontologyAssertions.addSubclassEdge(c2, c3);
        chai.expect(ontologyAssertions.existSubclassEdgeOntologyClass(c2, c3)).to.be.true;

        ontologyAssertions.addEquivalenceEdge(c3, c4)
        chai.expect(ontologyAssertions.existSubclassEdgeOntologyClass(c3, c4)).to.be.true;
        chai.expect(ontologyAssertions.existSubclassEdgeOntologyClass(c4, c3)).to.be.true;
    });
});

