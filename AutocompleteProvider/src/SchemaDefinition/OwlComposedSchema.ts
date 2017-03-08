import { RdfIri } from './RdfIri';
import { ClassDefinition } from './ClassDefinition';
var rdf = require('rdf');

enum OwlComposedType {
    Restriction,
    Intersection,
    Union,
    Unknown
}

interface IRDFNode {
    nominalValue: string;
    nodeType(): string;
}

interface Triple {
    subject: IRDFNode;
    predicate: IRDFNode;
    object: IRDFNode;
}

class TriplesArray {
    constructor(public triples: Triple[]) {

    }

    public match(subject: string, predicate: string, object: string) {
        var resultTriples = this.triples.filter((x) =>
            (subject == null || x.subject.nominalValue == subject) &&
            (predicate == null || x.predicate.nominalValue == predicate) &&
            (object == null || x.object.nominalValue == object)
        );

        return new TriplesArray(resultTriples);
    }

    public concat(tripleArray: TriplesArray) {
        return new TriplesArray(this.triples.concat(tripleArray.triples));
    }

    public getTriplesText() {
        var result = this.triples.map((x) => x.subject.nominalValue + ' ' +
            x.predicate.nominalValue + ' ' +
            x.object.nominalValue).join('\r\n');
        return result;
    }

    public containsAny() {
        return this.triples.length > 0;
    }

    public getFirst() {
        return this.triples[0];
    }
}

class GraphWrapper {
    private graph: any;
    constructor(private turtleSchema: string) {
        this.graph = this.parseTurtle();
    }

    private parseTurtle() {
        var environment = new rdf.RDFEnvironment();
        var turtleParser = new rdf.TurtleParser(environment);
        var result;
        try {
            // this function is not asynchronous
            turtleParser.parse(this.turtleSchema, (graph: any) => {
                result = graph;
            });
        }
        catch (e) {
            throw new Error('Parser problem' + e);
        }
        // TODO: Check for nulls
        return result;
    }

    public match(subject: any, predicate: any, object: any) {
        return new TriplesArray(this.graph.match(subject, predicate, object));
    }
    public getCollection(subject: string) {
        return this.graph.getCollection(subject);
    }
}

interface ISchemaClass {
    getText(): string;
}

class UnknownClass implements ISchemaClass {
    getText() {
        return 'Unknown';
    }
}

class AtomicClass implements ISchemaClass {

    constructor(public iri: string) {

    }

    getText() {
        return 'Atomic(' + this.iri + ')';
    }
}

class RestrictionClass implements ISchemaClass {

    constructor(public onProperty: string) {

    }

    getText() {
        return 'RestrictionOn(' + this.onProperty + ')';
    }
}

class IntersectionClass implements ISchemaClass {

    public classes: ISchemaClass[] = [];

    addClass(schemaClass: ISchemaClass) {
        this.classes.push(schemaClass);
        return this;
    }
    getText() {
        return 'Intersection(' + this.classes.map(x => x.getText()).join(', ') + ')';
    }

}

class UnionClass implements ISchemaClass {

    public classes: ISchemaClass[] = [];

    addClass(schemaClass: ISchemaClass) {
        this.classes.push(schemaClass);
        return this;
    }

    public getText() {
        return 'Union(' + this.classes.map(x => x.getText()).join(', ') + ')';
    }
}

class ClassTypeParser {

    constructor(private schemaGraph: GraphWrapper) {

    }

    public getIt(inferNode: IRDFNode) {
        var nodeType = inferNode.nodeType();
        if (nodeType == 'IRI') {
            return new AtomicClass(inferNode.nominalValue)
        }

        if (nodeType != 'BlankNode') {
            return new UnknownClass();
        }

        var inferClass = inferNode.nominalValue;
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

        return new UnknownClass();
    }

    private parseRestriction(currentTriples: TriplesArray, propertyTriples: TriplesArray) {
        var triple = propertyTriples.getFirst();
        return new RestrictionClass(triple.object.nominalValue);
    }
    private parseCollection() {

    }

    private parseIntersection(currentTriples: TriplesArray, propertyTriples: TriplesArray) {
        // TODO: Can go wrong 
        var unionNode = propertyTriples.getFirst().object.nominalValue;
        // TOD: Can throw exception
        var nodeCollection = this.schemaGraph.getCollection('_:' + unionNode);
        var result = new IntersectionClass();

        for (var node of nodeCollection) {
            result.addClass(this.getIt(node));
        }

        return result;
    }

    private parseUnion(currentTriples: TriplesArray, propertyTriples: TriplesArray) {
        // TODO: Can go wrong 
        var unionNode = propertyTriples.getFirst().object.nominalValue;
        // TOD: Can throw exception
        var nodeCollection = this.schemaGraph.getCollection('_:' + unionNode);
        var result = new UnionClass();

        for (var node of nodeCollection) {
            result.addClass(this.getIt(node));
        }

        return result;
    }
}

export class OwlComposedSchema {
    constructor(private turtleSchema: string) {

    }

    doMagic() {
        var schemaGraph = new GraphWrapper(this.turtleSchema);
        var classTypeParser = new ClassTypeParser(schemaGraph);

        var subclasstriples = schemaGraph.match(null, RdfIri.rdfsSubclassOf, null)
            .concat(schemaGraph.match(null, RdfIri.owlEquivalentClass, null));

        for (var triple of subclasstriples.triples) {
            var result = classTypeParser.getIt(triple.object);
            console.log(triple.subject + ' is ' + result.getText() + '\r\n');
        }
    }
}