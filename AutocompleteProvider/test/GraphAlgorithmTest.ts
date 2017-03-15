import { UnionClass, AtomicClass } from '../src/SchemaDefinition/OwlComposedSchema';
import { GroupsAlgorithm, GraphAssertions } from '../src/SchemaDefinition/GroupsAlgorithm';
import * as chai from 'chai';
import * as fs from 'fs';
var rdf = require('rdf');


function readFile(file: string) {
    var fileContent = fs.readFileSync(file).toString();
    return fileContent;
}

describe('GraphAlgoritm', () => {
    describe('GraphAsertions', () => {
        it('should correctlly work with classes.', () => {
            var graphAssertions = new GraphAssertions();
            var c1 = new AtomicClass('http://example.org/c1');
            var c2 = new AtomicClass('http://example.org/c2');

            graphAssertions.getIndexOrAddClass(c1);
            chai.expect(graphAssertions.findClass(c1)).to.equal(0);
            chai.expect(graphAssertions.findClass(c2)).to.equal(-1);

            graphAssertions.getIndexOrAddClass(c2);
            chai.expect(graphAssertions.findClass(c1)).to.equal(0);
            chai.expect(graphAssertions.findClass(c2)).to.equal(1);

            var c1Index = graphAssertions.getIndexOrAddClass(c2);
            chai.expect(c1Index).to.equal(1);
            chai.expect(graphAssertions.findClass(c1)).to.equal(0);
            chai.expect(graphAssertions.findClass(c2)).to.equal(1);
        });
        it('should correctlly work with subClasses.', () => {
            var graphAssertions = new GraphAssertions();
            var c1 = new AtomicClass('http://example.org/c1');
            var c2 = new AtomicClass('http://example.org/c2');
            var c3 = new AtomicClass('http://example.org/c2');
            var c4 = new AtomicClass('http://example.org/c4');

            graphAssertions.addSubclass(c1, c2);
            chai.expect(graphAssertions.existSubclassEdge(0, 1)).to.be.true;
            chai.expect(graphAssertions.existSubclassEdgeSchema(c1, c2)).to.be.true;
            chai.expect(graphAssertions.existSubclassEdgeSchema(c2, c3)).to.be.false;
            chai.expect(graphAssertions.existSubclassEdge(0, 2)).to.be.false;

            graphAssertions.addSubclass(c2, c3);
            chai.expect(graphAssertions.existSubclassEdgeSchema(c2, c3)).to.be.true;

            graphAssertions.addEquivalence(c3, c4)
            chai.expect(graphAssertions.existSubclassEdgeSchema(c3, c4)).to.be.true;
            chai.expect(graphAssertions.existSubclassEdgeSchema(c4, c3)).to.be.true;

        });
    });

    it('should load graph assertions.', () => {
        var groupsAlgorithm = new GroupsAlgorithm(fs.readFileSync(__dirname + '/ontologies/test.owl.ttl').toString());
        var graphAssertions = groupsAlgorithm.extreactOntologyAsertions();

        var cleverParentClass = new AtomicClass("http://example.org/test#CleverParent");
        var parentClass = new AtomicClass("http://example.org/test#Parent");

        var humanClass = new AtomicClass("http://example.org/test#Human");
        var humanUnionClass = (new UnionClass())
            .addClass(new AtomicClass("http://example.org/test#Woman"))
            .addClass(new AtomicClass("http://example.org/test#Man"));

        chai.expect(graphAssertions.existSubclassEdgeSchema(cleverParentClass, parentClass)).to.be.true;
        chai.expect(graphAssertions.existSubclassEdgeSchema(parentClass, cleverParentClass)).to.be.false;

        chai.expect(graphAssertions.existSubclassEdgeSchema(humanClass, humanUnionClass)).to.be.true;
        chai.expect(graphAssertions.existSubclassEdgeSchema(humanUnionClass, humanClass)).to.be.true;


    });

    it('should create strong components.', () => {
        // var groupsAlgorithm = new GroupsAlgorithm(fs.readFileSync(__dirname + '/ontologies/strongComponent.owl.ttl').toString());
        var groupsAlgorithm = new GroupsAlgorithm(fs.readFileSync(__dirname + '/ontologies/family.owl.ttl').toString());
        var result = groupsAlgorithm.compute();
        var fatherClass = new AtomicClass("http://example.org/test#Father");
        var index = result.getComponentIndexContainsNamedClass(fatherClass);
        var filtered = result.components.filter(x => x.originalClasses.length > 1);
        //        var eqClasses = result.components[index].originalClasses;
    });
});