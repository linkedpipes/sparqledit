export interface IRDFNode {
    nominalValue: string;
    nodeType(): string;
}

export interface ITriple {
    subject: IRDFNode;
    predicate: IRDFNode;
    object: IRDFNode;
}

export interface IGraph {
    match(subject: string, predicate: string, object: string): IGraph
    getCollection(subject: string): IRDFNode[]
    containsAny(): boolean
    getFirst(): ITriple
}
