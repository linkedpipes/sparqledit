import {IOntologyClass} from './OntologyClass';
import {VisGraph} from '../Visualisation/VisGraph';

export class OntologyConcept {
    constructor(public ontologyClasses: IOntologyClass[]) {

    }

    public containsClass(ontologyClass: IOntologyClass) {
        var schemaSignature = ontologyClass.getText();
        return this.ontologyClasses.some((x) => x.getText() == schemaSignature);
    }
}

export class OntologyHiearchy {
    public concepts: OntologyConcept[] = [];
    
    public subClassEdges: { superClass: number, subsetClass: number }[] = [];

    public addConcept(concept: OntologyConcept) {
        this.concepts.push(concept);
        return this.concepts.length - 1;
    }

    /**
     * Retruns -1 when class is not found.
     * @param schemaClass 
     */
    public getConceptIndexContainsOntologyClass(ontologyClass: IOntologyClass) {
        for (var i = 0; i < this.concepts.length; i++) {
            if (this.concepts[i].containsClass(ontologyClass)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Retruns null when class is not found.
     * @param schemaClass 
     */
    public getConceptContainsOntologyClass(ontologyClass: IOntologyClass) {
        for (var i = 0; i < this.concepts.length; i++) {
            if (this.concepts[i].containsClass(ontologyClass)) {
                return i;
            }
        }
        return null
    }

    public addSubclassEdge(superClass: number, subsetClass: number) {
        this.subClassEdges.push({ superClass: superClass, subsetClass: subsetClass });
    }

    public existSubclassEdge(superClass: number, subsetClass: number) {
        return this.subClassEdges.some((x) => x.subsetClass == subsetClass && x.superClass == superClass);
    }

    public serializeGraph() {
        var visGraph = new VisGraph();
        visGraph.nodes = this.concepts.map((x, i) => (
            {
                id: i,
                label: x.ontologyClasses.map(y => y.getText()).join('\n')
            }));

        visGraph.edges = this.subClassEdges.map((x) => ({ from: x.subsetClass, to: x.superClass }));
        return visGraph.serialize();
    }
}