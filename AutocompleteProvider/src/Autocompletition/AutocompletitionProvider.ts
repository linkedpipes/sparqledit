// import { RdfIri } from '../SchemaDefinition/RdfIri';
// import { Schema } from '../SchemaDefinition/Schema';
// import * as _ from 'lodash';

// export class VariableTypeItem {
//     public possibleClasses: string[] = [];
//     public possibleAdvices: string[] = [];

//     constructor(public name: string) {

//     }
// }

// export class AutocompleteContext {
//     public variables: VariableTypeItem[] = [];
    
//     getVariableContext(name: string) {
//         var matchedVariables = this.variables.filter(x => x.name == name);
//         var length = matchedVariables.length;
//         if (length > 1) {
//             throw new Error();
//         }
//         if (length == 0) {
//             return null;
//         }
//         return matchedVariables[0];
//     }
// }

// export enum NodeType {
//     Iri,
//     Blank,
//     Variable,
//     Literal,
// }

// export class Node {
//     private _originalValue: string;
//     private _value: string;
//     private _type: NodeType;

//     public get originalValue() {
//         return this._originalValue;
//     }

//     public get value() {
//         return this._value;
//     }

//     public get type() {
//         return this._type;
//     }

//     constructor(nodeValue: string) {
//         this._originalValue = nodeValue;
//         // TODO test the method especially substring
//         var startChar = nodeValue.substr(0, 1);
//         if (startChar === "?" || startChar === "$") {
//             //variable
//             this._type = NodeType.Variable;
//             this._value = nodeValue.substring(1, nodeValue.length);
//         } else if (startChar === "\"") {
//             //literal
//             this._type = NodeType.Literal;
//             this._value = nodeValue;
//         } else if (nodeValue.substr(0, 2) === "_:") {
//             // blank node
//             this._type = NodeType.Blank;
//             this._value = nodeValue.substring(2, nodeValue.length);
//         } else {
//             // iri 
//             this._type = NodeType.Iri;
//             this._value = nodeValue;
//         }
//     }
// }

// export class Triple {
//     public subject: Node;
//     public predicate: Node;
//     public object: Node;
//     constructor(subject: string,
//         predicate: string,
//         object: string) {

//         this.subject = new Node(subject);
//         this.predicate = new Node(predicate);
//         this.object = new Node(object);
//     }

//     getAllNodes() {
//         return [this.subject, this.predicate, this.object];
//     }
// }

// export class Block {
//     public triples: Triple[];

//     constructor(queryBlock: any) {
//         this.triples = queryBlock.map((x: any) =>
//             new Triple(x.subject,
//                 x.predicate,
//                 x.object)
//         );
//     }

//     matchNode(node: Node, value: string) {
//         if (value == null) {
//             return true;
//         }

//         return node.originalValue == value;
//     }

//     match(subject: string, predicate: string, object: string) {
//         var result = this.triples.filter(x => {
//             return this.matchNode(x.subject, subject) &&
//                 this.matchNode(x.predicate, predicate) &&
//                 this.matchNode(x.object, object);
//         });
//         return result;
//     }
// }

// export class AutocompleteProvider {
//     constructor(private schema: Schema) {
//     }

//     private extractAllVariablesNames(block: Block) {
//         var result = _(block.triples).map(x => x.getAllNodes())
//             .flatten()
//             .filter((x: Node) => x.type == NodeType.Variable)
//             .map((x: Node) => x.value)
//             .uniq()
//             .value();
//         return result;
//     }

//     private createContext(block: Block) {
//         var variableNames = this.extractAllVariablesNames(block);
//         var context = new AutocompleteContext();
//         for (var variableName of variableNames) {
//             context.variables.push(new VariableTypeItem(variableName));
//         }
//         return context;
//     }

//     private findAllRdfType(block: Block) {
//         var matchedTriples = block.match(null, RdfIri.rdfType, null);
//         return matchedTriples
//             .filter(x => x.subject.type == NodeType.Variable &&
//                 x.object.type == NodeType.Iri)
//             .map(x => ({
//                 variableName: x.subject.value,
//                 classIri: x.object.value
//             }));
//     }

//     private inferSomeThings(context: AutocompleteContext,
//         block: Block,
//         variableName: string,
//         classIri: string) {
//         this.setVariableType(context, variableName, classIri);
//         this.setInferencedAdvices(context, block, variableName, classIri);
//     }

//     private setInferencedAdvices(context: AutocompleteContext,
//         block: Block,
//         variableName: string,
//         classIri: string) {
//         var classSchema = this.schema.getClass(classIri);
//         if (classSchema == null) {
//             return;
//         }

//         var matchedTriples = block.match('?' + variableName, null, null);
//         // začatek variable, druhy varible.
//         for (var matchedTriple of matchedTriples) {
//             if (matchedTriple.predicate.type == NodeType.Variable) {
//                 var variableContext = context.getVariableContext(matchedTriple.predicate.value);
//                 var currentAdvices = classSchema.getPropertyNames();
//                 Array.prototype.push.apply(variableContext.possibleAdvices, currentAdvices);
//             }
//         }
//     }

//     private inferNextTypes(context: AutocompleteContext, block: Block, fromVariableName: string, variableSchema: ClassDefinition) {
//         var matchedTriples = block.match('?' + fromVariableName, null, null);
//         var newInferncedVariables = [];

//         var result = matchedTriples
//             .filter(matchedTriple => {
//                 var predicate = matchedTriple.predicate;
//                 return predicate.type == NodeType.Iri &&
//                     _.includes(variableSchema.getPropertyNames(), predicate.value) &&
//                     matchedTriple.object.type == NodeType.Variable;
//             })
//             .map(matchedTriple => ({
//                 variableName: matchedTriple.object.value,
//                 classIri: variableSchema.getProperty(matchedTriple.predicate.value).range
//             }));

//         return result;
//     }

//     private setVariableType(context: AutocompleteContext, variableName: string, classIri: string) {
//         var variableContext = context.getVariableContext(variableName);
//         variableContext.possibleClasses.push(classIri);
//     }

//     private inferenceStep(context: AutocompleteContext, block: Block) {
//         //najdi všechny x a type.
//         // 
//     }

//     private initStep(context: AutocompleteContext, block: Block) {
//         var rdfTypes = this.findAllRdfType(block);
//         rdfTypes.forEach(x => this.inferSomeThings(context, block, x.variableName, x.classIri));
//         return rdfTypes;
//     }

//     doAutocomplete(query: any) {
//         var queryBlock = query.where[0].triples;
//         var block = new Block(queryBlock);
//         var context = this.createContext(block);
//         var firstVariables = this.initStep(context, block)
//         var ss = _(firstVariables).map(
//             x => {
//                 var variableSchema = this.schema.getClass(x.classIri);
//                 if (variableSchema != null) {
//                     return this.inferNextTypes(context, block, x.variableName, variableSchema);
//                 }
//             }
//         ).flatten<{ variableName: string, classIri: string }>()
//         .value();
//         ss.forEach(x => this.inferSomeThings(context, block, x.variableName, x.classIri));
//     }
// }