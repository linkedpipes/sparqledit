import {RdfIri} from '../Utils/RdfIri';
import {IOntologyClass, AtomicClass, UnknownClass, RestrictionClass, IntersectionClass, UnionClass} from './OntologyClass';
import {IGraph, IRDFNode} from '../GraphTools/GraphInterfaces';
var rdf = require('rdf');

export class OntologyClassParser {
    private _schemaGraph: IGraph

    constructor(schemaGraph: IGraph) {
        this._schemaGraph = schemaGraph;
    }

    public get schemaGraph(): IGraph {
        return this._schemaGraph;
    }

    public getClassType(classNode: IRDFNode): IOntologyClass {
        var nodeType = classNode.nodeType();
        if (nodeType == "IRI") {
            return new AtomicClass(classNode.nominalValue)
        }

        if (nodeType != "BlankNode") {
            return new UnknownClass(classNode.nominalValue);
        }

        var inferClass = classNode.nominalValue;
        var currentTriples = this.schemaGraph.match('_:' + inferClass, null, null);
        var triples = currentTriples.match(null, RdfIri.owlOnProperty, null);
        if (triples.containsAny()) {
            return this.parseRestriction(currentTriples, triples);
        }

        var triples = currentTriples.match(null, RdfIri.owlUnionOf, null);
        if (triples.containsAny()) {
            return this.parseUnion(currentTriples, triples);
        }

        var triples = currentTriples.match(null, RdfIri.owlIntersectionOf, null);
        if (triples.containsAny()) {
            return this.parseIntersection(currentTriples, triples);
        }

        return new UnknownClass(classNode.nominalValue);
    }

    private parseRestriction(currentTriples: IGraph, propertyTriples: IGraph) {
        var triple = propertyTriples.getFirst();
        return new RestrictionClass(triple.object.nominalValue);
    }

    private parseIntersection(currentTriples: IGraph, propertyTriples: IGraph) {
        // TODO: Can go wrong 
        var unionNode = propertyTriples.getFirst().object.nominalValue;
        // TOD: Can throw exception
        var nodeCollection = this.schemaGraph.getCollection('_:' + unionNode);
        var result = new IntersectionClass();

        for (var node of nodeCollection) {
            result.addClass(this.getClassType(node));
        }

        return result;
    }

    private parseUnion(currentTriples: IGraph, propertyTriples: IGraph) {
        // TODO: Can go wrong 
        var unionNode = propertyTriples.getFirst().object.nominalValue;
        // TOD: Can throw exception
        var nodeCollection = this.schemaGraph.getCollection('_:' + unionNode);
        var result = new UnionClass();

        for (var node of nodeCollection) {
            result.addClass(this.getClassType(node));
        }

        return result;
    }
}