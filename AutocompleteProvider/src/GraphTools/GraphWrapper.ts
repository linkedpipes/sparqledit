var rdf = require('rdf');

export interface IRDFNode {
    nominalValue: string;
    nodeType(): string;
}

export interface Triple {
    subject: IRDFNode;
    predicate: IRDFNode;
    object: IRDFNode;
}

export class TriplesArray {
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

export class GraphWrapper {
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
