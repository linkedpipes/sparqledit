import {IGraph, ITriple, IRDFNode} from './GraphInterfaces';

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