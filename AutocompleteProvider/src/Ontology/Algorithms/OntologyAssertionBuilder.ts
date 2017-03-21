import { RdfIri } from '../../Utils/RdfIri';
import { IGraph } from '../../GraphTools/GraphInterfaces';
import { TurtleGraphWrapper } from '../../GraphTools/TurtleGraphWrapper';
import { OntologyClassParser } from '../OntologyClassParser';
import { OntologyAssertions } from '../OntologyAssertions';

export class OntologyAssertionsBuilder {

    public buildOntologyAsertions(graph: IGraph) {
        var ontologyClassParser = new OntologyClassParser(graph);
        var result = new OntologyAssertions();

        var subClassOfGraph = graph.match(null, RdfIri.rdfsSubclassOf, null);
        for (var subClassOfTriple of subClassOfGraph.getTriples()) {
            let subjectOntologyClass = ontologyClassParser.getClassType(subClassOfTriple.subject);
            let objectOntologyClass = ontologyClassParser.getClassType(subClassOfTriple.object);
            result.addSubclassEdge(subjectOntologyClass, objectOntologyClass);
        }

        var equalClassGraph = graph.match(null, RdfIri.owlEquivalentClass, null);
        for (var equalClassTriple of equalClassGraph.getTriples()) {
            let subjectOntologyClass = ontologyClassParser.getClassType(equalClassTriple.subject);
            let objectOntologyClass = ontologyClassParser.getClassType(equalClassTriple.object);
            result.addEquivalenceEdge(subjectOntologyClass, objectOntologyClass);
        }

        var domainGraph = graph.match(null, RdfIri.rdfsDomain, null);
        for (var domainTriple of domainGraph.getTriples()) {
            // TODO: add execeptions
            var propertyName = domainTriple.subject.nominalValue;
            var domainOntologyClass = ontologyClassParser.getClassType(domainTriple.object);
            result.addDomain(propertyName, domainOntologyClass);
        }

        var rangeGraph = graph.match(null, RdfIri.rdfsRange, null);
        for (var rangeTriple of rangeGraph.getTriples()) {
            // TODO: add execeptions
            var propertyName = rangeTriple.subject.nominalValue;
            var rangeOntologyClass = ontologyClassParser.getClassType(rangeTriple.object);
            result.addRange(propertyName, rangeOntologyClass);
        }

        return result;
    }
}