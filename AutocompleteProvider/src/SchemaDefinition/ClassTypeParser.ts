import { IGraph, IRDFNode, RDFNodeType } from '../GraphTools/GraphInterfaces';
import { SimpleGraph } from '../GraphTools/SimpleGraph';
import { RdfIri } from './RdfIri';
var rdf = require('rdf');

export enum OwlComposedType {
    Restriction,
    Intersection,
    Union,
    Unknown
}

export interface ISchemaClass {
    getText(): string;
}

export class UnknownClass implements ISchemaClass {

    constructor(public nodeValue: string) {

    }

    getText() {
        return 'Unknown(' + this.nodeValue + ')';
    }
}

export class AtomicClass implements ISchemaClass {

    constructor(public iri: string) {

    }

    getText() {
        return 'Atomic(' + this.iri + ')';
    }
}

export class RestrictionClass implements ISchemaClass {

    constructor(public onProperty: string) {

    }

    getText() {
        return 'RestrictionOn(' + this.onProperty + ')';
    }
}

export class IntersectionClass implements ISchemaClass {

    public classes: ISchemaClass[] = [];

    addClass(schemaClass: ISchemaClass) {
        this.classes.push(schemaClass);
        return this;
    }
    getText() {
        return 'Intersection(' + this.classes.map(x => x.getText()).join(', ') + ')';
    }

}

export class UnionClass implements ISchemaClass {

    public classes: ISchemaClass[] = [];

    addClass(schemaClass: ISchemaClass) {
        this.classes.push(schemaClass);
        return this;
    }

    public getText() {
        return 'Union(' + this.classes.map(x => x.getText()).join(', ') + ')';
    }
}

export class ClassTypeParser {
    private _schemaGraph: IGraph

    constructor(schemaGraph: IGraph) {
        this._schemaGraph = schemaGraph;
    }

    public get schemaGraph(): IGraph {
        return this._schemaGraph;
    }

    public getClassType(classNode: IRDFNode): ISchemaClass {
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