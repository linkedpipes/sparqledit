import { OntologyAssertions } from '../../src/Ontology/OntologyAssertions';
import { AtomicClass } from '../../src/Ontology/OntologyClass';

import * as chai from 'chai';
import * as fs from 'fs';

describe('OntologyAssertions', () => {
    it('should correctlly work with classes.', () => {
        var ontologyAssertions = new OntologyAssertions();
        var c1 = new AtomicClass('http://example.org/c1');
        var c2 = new AtomicClass('http://example.org/c2');

        ontologyAssertions.addOrGetClassIndex(c1);
        chai.expect(ontologyAssertions.findClass(c1)).to.equal(0);
        chai.expect(ontologyAssertions.findClass(c2)).to.equal(-1);

        ontologyAssertions.addOrGetClassIndex(c2);
        chai.expect(ontologyAssertions.findClass(c1)).to.equal(0);
        chai.expect(ontologyAssertions.findClass(c2)).to.equal(1);

        var c1Index = ontologyAssertions.addOrGetClassIndex(c2);
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

    describe('Properties', () => {
        var p1 = 'http://example.org/p1';
        var p2 = 'http://example.org/p2';
        var p3 = 'http://example.org/p3';
        var p4 = 'http://example.org/p4';
        var c1 = new AtomicClass('http://example.org/c1');
        var c2 = new AtomicClass('http://example.org/c2');
        var c3 = new AtomicClass('http://example.org/c3');

        it('should correctlly be find by name.', () => {
            var ontologyAssertions = new OntologyAssertions();
            ontologyAssertions.addDomain(p1, c1);
            chai.expect(ontologyAssertions.findPropertyByName(p2)).to.be.null;
            var p1Founded = ontologyAssertions.findPropertyByName(p1);
            chai.expect(p1Founded).not.to.be.null;
            chai.expect(p1Founded.domain.equal(c1)).to.be.true;
            chai.expect(p1Founded.range).to.be.null;

            ontologyAssertions.addRange(p1, c2);
            var p1Founded = ontologyAssertions.findPropertyByName(p1);
            chai.expect(p1Founded).not.to.be.null;
            chai.expect(p1Founded.domain.equal(c1)).to.be.true;
            chai.expect(p1Founded.range.equal(c2)).to.be.true;
        });

        it('should correctlly be find by domain.', () => {
            var ontologyAssertions = new OntologyAssertions();

            ontologyAssertions.addDomain(p1, c1);
            ontologyAssertions.addDomain(p2, c1);
            ontologyAssertions.addDomain(p4, c3);
            ontologyAssertions.addRange(p3, c2);

            var foundedPropertyNames1 = ontologyAssertions.findPropertiesByDomain(c1).map(x => x.name);
            chai.expect(foundedPropertyNames1).to.deep.equal([p1, p2]);

            var foundedPropertyNames2 = ontologyAssertions.findPropertiesByDomain(c2).map(x => x.name);
            chai.expect(foundedPropertyNames2).to.deep.equal([]);
        });

        it('should correctlly be find by range.', () => {
            var ontologyAssertions = new OntologyAssertions();

            ontologyAssertions.addRange(p1, c1);
            ontologyAssertions.addRange(p2, c1);
            ontologyAssertions.addRange(p4, c3);
            ontologyAssertions.addDomain(p3, c2);

            var foundedPropertyNames1 = ontologyAssertions.findPropertiesByRange(c1).map(x => x.name);
            chai.expect(foundedPropertyNames1).to.deep.equal([p1, p2]);

            var foundedPropertyNames2 = ontologyAssertions.findPropertiesByRange(c2).map(x => x.name);
            chai.expect(foundedPropertyNames2).to.deep.equal([]);
        });
    })
});

