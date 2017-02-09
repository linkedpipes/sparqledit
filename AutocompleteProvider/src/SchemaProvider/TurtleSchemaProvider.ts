import { ClassDefinition } from '../SchemaDefinition/ClassDefinition';
import { PropertyDefinition } from '../SchemaDefinition/PropertyDefinition';
import { Schema } from '../SchemaDefinition/Schema';
import { ISchemaProvider } from './ISchemaProvider';
import * as Promise from 'promise';
var rdf = require('rdf');


export class TurtleSchemaProvider implements ISchemaProvider {
    private rdfType = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
    private rdfsClass = "http://www.w3.org/2000/01/rdf-schema#Class";
    private rdfsProperty = "http://www.w3.org/2000/01/rdf-schema#Property";
    private rdfsDomain = "http://www.w3.org/2000/01/rdf-schema#domain";
    private rdfsRange = "http://www.w3.org/2000/01/rdf-schema#range";
    private rdfsLabel = "http://www.w3.org/2000/01/rdf-schema#label";

    constructor(private turtleContent: string) {

    }

    private parseTurtle() {
        var environment = new rdf.RDFEnvironment();
        var turtleParser = new rdf.TurtleParser(environment);
        var result;
        try {
            // this function is not asynchronous
            turtleParser.parse(this.turtleContent, (graph: any) => {
                result = graph;
            });
        }
        catch (e) {
            throw new Error('Parser problem');
        }
        return result;
    }

    private getClassNames(graph: any) {
        var classesTriples = graph.match(null, this.rdfType, this.rdfsClass);
        var classNames = classesTriples.map((x: any) => {
            var classNode = x.subject;
            if (classNode.nodeType() != 'IRI') {
                throw new Error('Shoud be there iri');
            }
            var className: string = classNode.nominalValue;
            return className;
        });
        return classNames;
    }

    private getPropertiesNames(graph: any) {
        var propertiesTriples = graph.match(null, this.rdfType, this.rdfsProperty);
        var propertiesNames = propertiesTriples.map((x: any) => {
            var propertyNode = x.subject;
            if (propertyNode.nodeType() != 'IRI') {
                throw new Error('Shoud be there iri');
            }
            var propertyName: string = propertyNode.nominalValue;
            return propertyName;
        });
        return propertiesNames;
    }

    private extractObjectFromGraph(graph: any, subject: string, verb: string) {
        var matchedTriples = graph.match(subject, verb, null);

        if (matchedTriples.length > 1) {
            // todo catch this exception
            throw new Error('More triples are posible.');
        }

        if (matchedTriples.length == 0) {
            return null;
        }

        // todo check if there is IRI and if nominalValue has value
        return matchedTriples[0].object.nominalValue;
    }

    private extractProperties(graph: any) {
        var propertiesNames = this.getPropertiesNames(graph);
        var propertiesDefinitions: PropertyDefinition[] = [];

        for (var propertyName of propertiesNames) {
            // TODO: check for null and warn
            var range: string = this.extractObjectFromGraph(graph, propertyName, this.rdfsRange);
            var domain: string = this.extractObjectFromGraph(graph, propertyName, this.rdfsDomain);
            var label: string = this.extractObjectFromGraph(graph, propertyName, this.rdfsLabel) || "";

            var currentPropertyDefinition = new PropertyDefinition(propertyName,
                domain,
                range);
            currentPropertyDefinition.label = label;

            propertiesDefinitions.push(currentPropertyDefinition);
        }
        return propertiesDefinitions;
    }

    private extractClasses(graph: any) {
        var classNames = this.getClassNames(graph);
        var propertyDefinitions = this.extractProperties(graph);
        var classDefinitions: ClassDefinition[] = [];

        for (var className of classNames) {
            var currentPropertyDefinitions = propertyDefinitions.filter(x => x.domain == className);
            var label: string = this.extractObjectFromGraph(graph, className, this.rdfsLabel) || "";
            var currentClassDefinition = new ClassDefinition(className, currentPropertyDefinitions);
            currentClassDefinition.label = label;
            classDefinitions.push(currentClassDefinition);
        }
        return classDefinitions;
    }

    getSchema() {
        var graph: any = this.parseTurtle();
        var classDefinitions = this.extractClasses(graph);
        var exampleSchema = new Schema(classDefinitions);
        return exampleSchema;
    }
}