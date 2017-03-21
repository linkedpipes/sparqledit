import { IOntologyClass } from './OntologyClass';
import { VisGraph } from '../Visualisation/VisGraph';

export class OntologyProperty {

    public domain: IOntologyClass = null;

    public range: IOntologyClass = null;

    constructor(public name: string) {

    }
}

export class OntologyAssertions {

    public classes: IOntologyClass[] = [];

    public subClassEdges: { superClass: number, subsetClass: number }[] = [];

    public properties: OntologyProperty[] = [];

    private addOrGetProperty(propertyName: string) {
        var foundedProperty = this.findPropertyByName(propertyName);
        if (foundedProperty != null) {
            return foundedProperty;
        }
        var newProperty = new OntologyProperty(propertyName);
        this.properties.push(newProperty);
        return newProperty
    }

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
    public addOrGetClassIndex(schemaClass: IOntologyClass) {
        var findedClassIndex = this.findClass(schemaClass);
        if (findedClassIndex != -1) {
            return findedClassIndex;
        }
        this.classes.push(schemaClass);
        return this.classes.length - 1;
    }

    public findPropertyByName(propertyName: string) {
        for (var property of this.properties) {
            if (property.name == propertyName) {
                return property;
            }
        }
        return null;
    }

    public findPropertiesByDomain(domain: IOntologyClass) {
        return this.properties.filter(x => x.domain != null && x.domain.equal(domain));
    }

    public findPropertiesByRange(range: IOntologyClass) {
        return this.properties.filter(x => x.range != null && x.range.equal(range));
    }

    public existSubclassEdgeOntologyClass(superClass: IOntologyClass, subsetClass: IOntologyClass) {
        return this.existSubclassEdge(this.findClass(superClass), this.findClass(subsetClass));
    }

    public existSubclassEdge(superClass: number, subsetClass: number) {
        return this.subClassEdges.some((x) => x.subsetClass == subsetClass && x.superClass == superClass);
    }

    public addSubclassEdge(superClass: IOntologyClass, subsetClass: IOntologyClass) {
        var superClassIndex = this.addOrGetClassIndex(superClass);
        var subsetClassIndex = this.addOrGetClassIndex(subsetClass);

        if (!this.existSubclassEdge(superClassIndex, subsetClassIndex)) {
            this.subClassEdges.push({ superClass: superClassIndex, subsetClass: subsetClassIndex });
        }
    }

    public addEquivalenceEdge(firstClass: IOntologyClass, secondClass: IOntologyClass) {
        this.addSubclassEdge(firstClass, secondClass);
        this.addSubclassEdge(secondClass, firstClass);
    }

    public addDomain(propertyName: string, domain: IOntologyClass) {
        this.addOrGetClassIndex(domain);
        var property = this.addOrGetProperty(propertyName);
        property.domain = domain;
    }

    public addRange(propertyName: string, range: IOntologyClass) {
        this.addOrGetClassIndex(range);
        var property = this.addOrGetProperty(propertyName);
        property.range = range;
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