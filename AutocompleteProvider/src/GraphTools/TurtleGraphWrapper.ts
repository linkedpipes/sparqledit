import { IRDFNode, IGraph, ITriple } from './GraphInterfaces';
import { SimpleGraph } from './SimpleGraph';
var rdf = require('rdf');

export class TurtleGraphWrapper implements IGraph {
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
        return new SimpleGraph(this.graph.match(subject, predicate, object));
    }

    anyObject(subject: string, predicate: string): IRDFNode {
        return this.graph.match(subject, predicate, null)[0].object;
    }

    eachObject(subject: string, predicate: string): IRDFNode[] {
        var result = this.graph.match(subject, predicate, null)
            .map((x: any) => x.object);
        return result;
    }


    public getCollection(subject: string) {
        return this.graph.getCollection(subject);
    }

    public containsAny(): boolean {
        throw new Error('Method not implemented.');
    }

    public getFirst(): ITriple {
        throw new Error('Method not implemented.');
    }

}
