import { IGraph, ITriple, IRDFNode } from './GraphInterfaces';

export class SimpleGraph implements IGraph {

    constructor(public triples: ITriple[]) {

    }

    public match(subject: string, predicate: string, object: string) {
        var resultTriples = this.triples.filter((x) =>
            (subject == null || x.subject.nominalValue == subject) &&
            (predicate == null || x.predicate.nominalValue == predicate) &&
            (object == null || x.object.nominalValue == object)
        );

        return new SimpleGraph(resultTriples);
    }

    anyObject(subject: string, predicate: string): IRDFNode {
        for (var triple of this.triples) {
            if ((subject == null || triple.subject.nominalValue == subject) &&
                (predicate == null || triple.predicate.nominalValue == predicate)) {
                return triple.object;
            }
        }
        return null;
    }

    eachObject(subject: string, predicate: string): IRDFNode[] {
        var resultObjects = this.triples.filter((x) =>
            (subject == null || x.subject.nominalValue == subject) &&
            (predicate == null || x.predicate.nominalValue == predicate)
        ).map(x => x.object);
        return resultObjects;
    }
    
    public concat(tripleArray: SimpleGraph) {
        return new SimpleGraph(this.triples.concat(tripleArray.triples));
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

    getCollection(subject: string): IRDFNode[] {
        // TODO: implemet
        throw new Error('Method not implemented.');
    }

}