import {TurtleGraphWrapper} from '../../src/GraphTools/TurtleGraphWrapper';
import {OntologyClassParser} from '../../src/Ontology/OntologyClassParser';
import {IRDFNode} from '../../src/GraphTools/GraphInterfaces';
import {RdfIri} from '../../src/SchemaDefinition/RdfIri';
import {UnionClass, AtomicClass, IntersectionClass, UnknownClass} from '../../src/Ontology/OntologyClass';

import * as chai from 'chai';
import * as fs from 'fs';
var rdf = require('rdf');

var iriBasePrefix = "http://example.org/test#";

function createTestParser() {
    var ontologyContent = fs.readFileSync(__dirname + "/resources/ontologyClassParserTest.ttl").toString();
    var graph = new TurtleGraphWrapper(ontologyContent);
    var parser = new OntologyClassParser(graph);
    return parser;
}

describe('OntologyClassParser', () => {
    it('should parse atomic node.', () => {
        var parser = createTestParser();
        var testClassIri = iriBasePrefix + 'A';
        var atomicNode: IRDFNode = {
            nodeType: function () {
                return 'IRI';
            },
            nominalValue: testClassIri
        };

        var result = parser.getClassType(atomicNode);
        chai.expect(result.getText()).to.equal("Atomic(" + testClassIri + ")");
    });

    it('should parse node with intersection and union.', () => {
        var parser = createTestParser();

        var nodeForTypeParsing = parser.schemaGraph.anyObject(iriBasePrefix + 'A', RdfIri.owlEquivalentClass);
        var result = parser.getClassType(nodeForTypeParsing);

        var expectedNode = (new UnionClass())
            .addClass(new AtomicClass(iriBasePrefix + 'B'))
            .addClass(new AtomicClass(iriBasePrefix + 'C'))
            .addClass((new IntersectionClass()
                .addClass(new AtomicClass(iriBasePrefix + 'D'))
                .addClass(new AtomicClass(iriBasePrefix + 'E')))
            );

        chai.expect(result.getText()).to.equal(expectedNode.getText());
    });

    it('should parse restriction class', () => {
        var parser = createTestParser();
        var nodeForTypeParsing = parser.schemaGraph.anyObject(iriBasePrefix + 'RestrictionClass', RdfIri.owlEquivalentClass);
        var result = parser.getClassType(nodeForTypeParsing);
        chai.expect(result.getText()).equal("RestrictionOn(" + iriBasePrefix + "RestrictionProperty)");
    })

    it('should parse unknown class', () => {
        var parser = createTestParser();

        var nodesForTypeParsing = parser.schemaGraph.eachObject(iriBasePrefix + 'UnknownClassTest', RdfIri.rdfsSubclassOf);
        for (var node of nodesForTypeParsing) {
            var result = parser.getClassType(node);
            chai.expect(result instanceof UnknownClass).to.be.true;
        }
    })

    it('should parse type with blank nodes.', () => {
        var parser = createTestParser();

        var nodeForTypeParsing = parser.schemaGraph.anyObject(iriBasePrefix + 'BlankTestClass1', RdfIri.owlEquivalentClass);
        var result = parser.getClassType(nodeForTypeParsing);

        var expectedNode = (new UnionClass())
            .addClass(new AtomicClass(iriBasePrefix + 'BlankTestClass2'))
            .addClass(new AtomicClass(iriBasePrefix + 'BlankTestClass3'));

        chai.expect(result.getText()).to.equal(expectedNode.getText());
    });

    it('should parse cycles with blank nodes.', () => {
        // TODO: shoud not fail
        chai.assert.Throw(() => {
            var parser = createTestParser();
            var nodeForTypeParsing = parser.schemaGraph.anyObject(iriBasePrefix + 'CycleBlankTestClass1', RdfIri.owlEquivalentClass)
            var result = parser.getClassType(nodeForTypeParsing);

            console.log(result);
        }, "Maximum call stack size exceeded");
    });
});