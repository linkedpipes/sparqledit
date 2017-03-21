import { OntologyAssertions } from '../../src/Ontology/OntologyAssertions';
import { AtomicClass, UnknownClass, RestrictionClass, IntersectionClass, UnionClass } from '../../src/Ontology/OntologyClass';

import * as chai from 'chai';
import * as fs from 'fs';

describe('OntologyClass', () => {
    describe('OntologyClass equal method', () => {
        it('should work for AtomicClass.', () => {
            var ac1 = new AtomicClass('http://example.org/test1');
            var ac2 = new AtomicClass('http://example.org/test1');
            var ac3 = new AtomicClass('http://example.org/test2');
            var uc1 = new UnknownClass("test");
            chai.expect(ac1.equal(ac1)).to.be.true;
            chai.expect(ac1.equal(ac2)).to.be.true;
            chai.expect(ac1.equal(ac3)).to.be.false;
            chai.expect(ac1.equal(uc1)).to.be.false;
        });

        it('should work for UnknownClass.', () => {
            var uc1 = new UnknownClass("test1");
            var uc2 = new UnknownClass("test1");
            var uc3 = new UnknownClass("test2");
            var ac1 = new AtomicClass('http://example.org/test');

            chai.expect(uc1.equal(uc1)).to.be.true;
            chai.expect(uc1.equal(uc2)).to.be.true;
            chai.expect(uc1.equal(uc3)).to.be.false;
            chai.expect(uc1.equal(ac1)).to.be.false;
        });

        it('should work for RestrictionClass.', () => {
            var rc1 = new RestrictionClass("http://example.org/test1");
            var rc2 = new RestrictionClass("http://example.org/test1");
            var rc3 = new RestrictionClass("http://example.org/test2");
            var ac1 = new AtomicClass('http://example.org/test');

            chai.expect(rc1.equal(rc1)).to.be.true;
            chai.expect(rc1.equal(rc2)).to.be.true;
            chai.expect(rc1.equal(rc3)).to.be.false;
            chai.expect(rc1.equal(ac1)).to.be.false;
        });

        it('should work for IntersectionClass.', () => {
            var ac1 = new AtomicClass("http://example.org/test1");
            var ac2 = new AtomicClass("http://example.org/test2");
            var ac3 = new AtomicClass("http://example.org/test3");
            var ac4 = new AtomicClass("http://example.org/test4");

            // should work with empty lists
            var einc1 = new IntersectionClass();
            var einc2 = new IntersectionClass();

            chai.expect(einc1.equal(einc2)).to.be.true;
            chai.expect(einc2.equal(einc1)).to.be.true;

            // should be reflexive
            var inc1 = (new IntersectionClass())
                .addClass(ac1)
                .addClass(ac2)
                .addClass(ac3)
                .addClass(ac4);

            chai.expect(inc1.equal(inc1)).to.be.true;

            // should not be equal with UnionClass
            var unc1 = (new UnionClass())
                .addClass(ac1)
                .addClass(ac2)
                .addClass(ac3)
                .addClass(ac4);

            chai.expect(inc1.equal(unc1)).to.be.false;
            chai.expect(unc1.equal(inc1)).to.be.false;

            // should be equal even classes are permuted
            var inc2 = (new IntersectionClass())
                .addClass(ac2)
                .addClass(ac3)
                .addClass(ac1)
                .addClass(ac4);

            chai.expect(inc1.equal(inc2)).to.be.true;
            chai.expect(inc2.equal(inc1)).to.be.true;

            // should not equal even lists are subset
            var inc3 = (new IntersectionClass())
                .addClass(ac1)
                .addClass(ac2)
                .addClass(ac3);

            chai.expect(inc1.equal(inc3)).to.be.false;
            chai.expect(inc3.equal(inc1)).to.be.false;

            // should not equal when list are completely different
            var inc4 = (new IntersectionClass())
                .addClass(ac2)
                .addClass(ac3);
            
            var inc5 = (new IntersectionClass())
                .addClass(ac1)
                .addClass(ac4);
            
            chai.expect(inc4.equal(inc5)).to.be.false;
            chai.expect(inc5.equal(inc4)).to.be.false;

            // should work with duplicity
            var inc6 = (new IntersectionClass())
                .addClass(ac1)
                .addClass(ac2)
                .addClass(ac3)
                .addClass(ac4)
                .addClass(ac3)
                .addClass(ac4);
            
            var inc7 = (new IntersectionClass())
                .addClass(ac1)
                .addClass(ac2)
                .addClass(ac3)
                .addClass(ac4)
                .addClass(ac3)
                .addClass(ac2)
                .addClass(ac2);
             
            chai.expect(inc6.equal(inc7)).to.be.true;
            chai.expect(inc7.equal(inc6)).to.be.true;             
        });

        it('should work for UnionClass.', () => {
            var ac1 = new AtomicClass("http://example.org/test1");
            var ac2 = new AtomicClass("http://example.org/test2");
            var ac3 = new AtomicClass("http://example.org/test3");
            var ac4 = new AtomicClass("http://example.org/test4");

            // should work with empty lists
            var eunc1 = new UnionClass();
            var eunc2 = new UnionClass();

            chai.expect(eunc1.equal(eunc2)).to.be.true;
            chai.expect(eunc2.equal(eunc1)).to.be.true;

            // should be reflexive
            var unc1 = (new UnionClass())
                .addClass(ac1)
                .addClass(ac2)
                .addClass(ac3)
                .addClass(ac4);

            chai.expect(unc1.equal(unc1)).to.be.true;

            // should not be equal with UnionClass
            var inc1 = (new IntersectionClass())
                .addClass(ac1)
                .addClass(ac2)
                .addClass(ac3)
                .addClass(ac4);

            chai.expect(unc1.equal(inc1)).to.be.false;
            chai.expect(inc1.equal(unc1)).to.be.false;

            // should be equal even classes are permuted
            var unc2 = (new UnionClass())
                .addClass(ac2)
                .addClass(ac3)
                .addClass(ac1)
                .addClass(ac4);

            chai.expect(unc1.equal(unc2)).to.be.true;
            chai.expect(unc2.equal(unc1)).to.be.true;

            // should not equal even lists are subset
            var unc3 = (new UnionClass())
                .addClass(ac1)
                .addClass(ac2)
                .addClass(ac3);

            chai.expect(unc1.equal(unc3)).to.be.false;
            chai.expect(unc3.equal(unc1)).to.be.false;

            // should not equal when list are completely different
            var unc4 = (new UnionClass())
                .addClass(ac2)
                .addClass(ac3);
            
            var unc5 = (new UnionClass())
                .addClass(ac1)
                .addClass(ac4);
            
            chai.expect(unc4.equal(unc5)).to.be.false;
            chai.expect(unc5.equal(unc4)).to.be.false;

            // should work with duplicity
            var unc6 = (new UnionClass())
                .addClass(ac1)
                .addClass(ac2)
                .addClass(ac3)
                .addClass(ac4)
                .addClass(ac3)
                .addClass(ac4);
            
            var unc7 = (new UnionClass())
                .addClass(ac1)
                .addClass(ac2)
                .addClass(ac3)
                .addClass(ac4)
                .addClass(ac3)
                .addClass(ac2)
                .addClass(ac2);
             
            chai.expect(unc6.equal(unc7)).to.be.true;
            chai.expect(unc7.equal(unc6)).to.be.true;             
        });


    });
});

