import {RdfIri} from '../../Utils/RdfIri';
import {IGraph} from '../../GraphTools/GraphInterfaces';
import { TurtleGraphWrapper } from '../../GraphTools/TurtleGraphWrapper';
import {OntologyClassParser} from '../OntologyClassParser';
import {OntologyAssertions} from '../OntologyAssertions';

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

        return result;
    }
}