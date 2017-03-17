export type RDFNodeType = "IRI" | "BlankNode" | "PlainLiteral" | "TypedLiteral";

export interface IRDFNode {
    nominalValue: string;
    nodeType(): RDFNodeType;
}

export interface ITriple {
    subject: IRDFNode;
    predicate: IRDFNode;
    object: IRDFNode;
}

export interface IGraph {
    getTriples(): ITriple[]
    match(subject: string, predicate: string, object: string): IGraph
    anyObject(subject: string, predicate: string): IRDFNode
    eachObject(subject: string, predicate: string): IRDFNode[]
    getCollection(subject: string): IRDFNode[]
    containsAny(): boolean
    getFirst(): ITriple
}
