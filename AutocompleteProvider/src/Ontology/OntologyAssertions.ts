import { IOntologyClass } from './OntologyClass';
import { VisGraph } from '../Visualisation/VisGraph';

export class OntologyAssertions {

    public classes: IOntologyClass[] = [];

    public subClassEdges: { superClass: number, subsetClass: number }[] = [];

    /**
     *  Returns index of class. If no class match returns -1.
     */
    public findClass(schemaClass: IOntologyClass) {
        var schemaSignature = schemaClass.getText();
        var index = 0;
        for (var currentclass of this.classes) {
            if (currentclass.getText() == schemaSignature) {
                return index;
            }
            index++;
        }
        return -1;
    }

    /**
     * Adds class and returns the class index. If class already exists returns class index and no class is added. 
     * @param schemaClass 
     */
    public addClassOrGetIndex(schemaClass: IOntologyClass) {
        var findedClassIndex = this.findClass(schemaClass);
        if (findedClassIndex != -1) {
            return findedClassIndex;
        }
        this.classes.push(schemaClass);
        return this.classes.length - 1;
    }

    public existSubclassEdgeOntologyClass(superClass: IOntologyClass, subsetClass: IOntologyClass) {
        return this.existSubclassEdge(this.findClass(superClass), this.findClass(subsetClass));
    }

    public existSubclassEdge(superClass: number, subsetClass: number) {
        return this.subClassEdges.some((x) => x.subsetClass == subsetClass && x.superClass == superClass);
    }

    public addSubclassEdge(superClass: IOntologyClass, subsetClass: IOntologyClass) {
        var superClassIndex = this.addClassOrGetIndex(superClass);
        var subsetClassIndex = this.addClassOrGetIndex(subsetClass);

        if (!this.existSubclassEdge(superClassIndex, subsetClassIndex)) {
            this.subClassEdges.push({ superClass: superClassIndex, subsetClass: subsetClassIndex });
        }
    }

    public addEquivalenceEdge(firstClass: IOntologyClass, secondClass: IOntologyClass) {
        this.addSubclassEdge(firstClass, secondClass);
        this.addSubclassEdge(secondClass, firstClass);
    }

    public addDomain() {

    }

    public addRange() {

    }

    public toVisGraph() {
        var visGraph = new VisGraph();
        visGraph.nodes = this.classes.map((x, i) => (
            {
                id: i,
                label: x.getText()
            }));

        visGraph.edges = this.subClassEdges.map((x) => ({ from: x.subsetClass, to: x.superClass }));
        return visGraph.serialize();
    }
}