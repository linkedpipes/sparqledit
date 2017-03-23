import { OntologyAssertions } from './OntologyAssertions';
import { IOntologyClass } from './OntologyClass';
import { VisGraph } from '../Visualisation/VisGraph';

export class OntologyConcept {
    constructor(public ontologyClasses: IOntologyClass[]) {

    }

    public containsClass(ontologyClass: IOntologyClass) {
        var schemaSignature = ontologyClass.getText();
        return this.ontologyClasses.some((x) => x.getText() == schemaSignature);
    }
}

export class OntologyConceptSubclassOfEdge {
    public superClassIndex: number;
    public subsetClassIndex: number;
    public superClassConcept: OntologyConcept;
    public subsetClassConcept: OntologyConcept;
}

export class OntologyHiearchy {
    public ontologyAssertions: OntologyAssertions
    
    public concepts: OntologyConcept[] = [];

    public subClassOfEdges: OntologyConceptSubclassOfEdge[] = [];

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
    public getConceptContainsOntologyClass(ontologyClass: IOntologyClass): OntologyConcept {
        for (var i = 0; i < this.concepts.length; i++) {
            if (this.concepts[i].containsClass(ontologyClass)) {
                return this.concepts[i];
            }
        }
        return null;
    }

    public addSubclassOfEdge(superClassIndex: number, subsetClassIndex: number) {
        var newEdge = new OntologyConceptSubclassOfEdge();
        newEdge.superClassIndex = superClassIndex;
        newEdge.subsetClassIndex = subsetClassIndex;
        newEdge.superClassConcept = this.concepts[superClassIndex];
        newEdge.subsetClassConcept = this.concepts[subsetClassIndex];
        this.subClassOfEdges.push(newEdge);
    }

    public existSubclassOfEdge(superClassIndex: number, subsetClassIndex: number) {
        return this.subClassOfEdges.some((x) => x.subsetClassIndex == subsetClassIndex && x.superClassIndex == superClassIndex);
    }

    public existsSubclassOfEdgeConcept(superClassConcept: OntologyConcept, subsetClassConcept: OntologyConcept) {
        return this.subClassOfEdges.some(x => x.subsetClassConcept == subsetClassConcept && x.superClassConcept == superClassConcept);
    }

    public getAllSuperClasses(subsetClassConcept: OntologyConcept) {
        return this.subClassOfEdges.filter(x => x.subsetClassConcept == subsetClassConcept).map(x => x.superClassConcept);
    }

    public serializeGraph() {
        var visGraph = new VisGraph();
        visGraph.nodes = this.concepts.map((x, i) => (
            {
                id: i,
                label: x.ontologyClasses.map(y => y.getText()).join('\n')
            }));

        visGraph.edges = this.subClassOfEdges.map((x) => ({ from: x.subsetClassIndex, to: x.superClassIndex }));
        return visGraph.serialize();
    }
}