import {VisGraph} from '../Visualisation/VisGraph';
import {RdfIri} from './RdfIri';
import { ISchemaClass, ClassTypeParser } from './ClassTypeParser';
import { TurtleGraphWrapper } from "GraphTools/TurtleGraphWrapper";

var scc = require("strongly-connected-components")

export class GraphAssertions {
    public namedClasses: ISchemaClass[] = [];
    public subclassEdges: { superClass: number, subsetClass: number }[] = [];

    /**
     *  Returns index of class. If no class match returns -1.
     */
    public findClass(schemaClass: ISchemaClass) {
        var schemaSignature = schemaClass.getText();
        var index = 0;
        for (var currentclass of this.namedClasses) {
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
    public getIndexOrAddClass(schemaClass: ISchemaClass) {
        var findedClassIndex = this.findClass(schemaClass);
        if (findedClassIndex != -1) {
            return findedClassIndex;
        }
        this.namedClasses.push(schemaClass);
        return this.namedClasses.length - 1;
    }

    public existSubclassEdgeSchema(superClass: ISchemaClass, subsetClass: ISchemaClass) {
        return this.existSubclassEdge(this.findClass(superClass), this.findClass(subsetClass));
    }

    public existSubclassEdge(superClass: number, subsetClass: number) {
        return this.subclassEdges.some((x) => x.subsetClass == subsetClass && x.superClass == superClass);
    }

    public addSubclass(superClass: ISchemaClass, subsetClass: ISchemaClass) {
        var superClassIndex = this.getIndexOrAddClass(superClass);
        var subsetClassIndex = this.getIndexOrAddClass(subsetClass);

        if (!this.existSubclassEdge(superClassIndex, subsetClassIndex)) {
            this.subclassEdges.push({ superClass: superClassIndex, subsetClass: subsetClassIndex });
        }
    }

    public addEquivalence(firstClass: ISchemaClass, secondClass: ISchemaClass) {
        this.addSubclass(firstClass, secondClass);
        this.addSubclass(secondClass, firstClass);
    }

    public addDomain() {

    }

    public addRange() {

    }

    public serializeGraph() {
        var visGraph = new VisGraph();
        visGraph.nodes = this.namedClasses.map((x, i) => (
            {
                id: i,
                label: x.getText()
            }));

        visGraph.edges = this.subclassEdges.map((x) => ({ from: x.subsetClass, to: x.superClass }));
        return visGraph.serialize();
    }

}


export class ComputeStrongComponents {
    private convertEdgesToAdjacentList(subclassEdges: { superClass: number, subsetClass: number }[], nodeCount: number) {
        var result: number[][] = new Array(nodeCount);
        for (var i = 0; i < nodeCount; i++) {
            result[i] = [];
        }
        for (var edge of subclassEdges) {
            result[edge.subsetClass].push(edge.superClass);
        }
        return result;
    }

    compute(subclassEdges: { superClass: number, subsetClass: number }[], nodeCount: number) {
        var adjacencyList = this.convertEdgesToAdjacentList(subclassEdges, nodeCount);
        var res = scc(adjacencyList);
        return res;
    }
}
export class Component {
    constructor(public originalClasses: ISchemaClass[]) {

    }

    public containsClass(schemaClass: ISchemaClass) {
        var schemaSignature = schemaClass.getText();
        return this.originalClasses.some((x) => x.getText() == schemaSignature);
    }
}

export class ComponentGraph {
    public components: Component[] = [];
    public subclassEdges: { superClass: number, subsetClass: number }[] = [];

    public addComponent(component: Component) {
        this.components.push(component);
        return this.components.length - 1;
    }

    /**
     * Retruns -1 when class is not found.
     * @param schemaClass 
     */
    public getComponentIndexContainsNamedClass(schemaClass: ISchemaClass) {
        for (var i = 0; i < this.components.length; i++) {
            if (this.components[i].containsClass(schemaClass)) {
                return i;
            }
        }
        return -1;
    }

    public addSubclassEdge(superClass: number, subsetClass: number) {
        this.subclassEdges.push({ superClass: superClass, subsetClass: subsetClass });
    }

    public existSubclassEdge(superClass: number, subsetClass: number) {
        return this.subclassEdges.some((x) => x.subsetClass == subsetClass && x.superClass == superClass);
    }

    public serializeGraph() {
        var visGraph = new VisGraph();
        visGraph.nodes = this.components.map((x, i) => (
            {
                id: i,
                label: x.originalClasses.map(y => y.getText()).join('\n')
            }));

        visGraph.edges = this.subclassEdges.map((x) => ({ from: x.subsetClass, to: x.superClass }));
        return visGraph.serialize();
    }
}

export class GroupsAlgorithm {

    constructor(private turtleSchema: string) {

    }

    public extreactOntologyAsertions() {
        var schemaGraph = new TurtleGraphWrapper(this.turtleSchema);
        var classTypeParser = new ClassTypeParser(schemaGraph);
        var result = new GraphAssertions();

        var subclasstriples = schemaGraph.match(null, RdfIri.rdfsSubclassOf, null);
        for (var subClassEdge of subclasstriples.triples) {
            result.addSubclass(classTypeParser.getIt(subClassEdge.subject), classTypeParser.getIt(subClassEdge.object));
        }

        var equalclasstriples = schemaGraph.match(null, RdfIri.owlEquivalentClass, null);
        for (var equalclasstriple of equalclasstriples.triples) {
            result.addEquivalence(classTypeParser.getIt(equalclasstriple.subject), classTypeParser.getIt(equalclasstriple.object));
        }

        return result;
    }

    public createComponentGraph(graphAssertions: GraphAssertions) {
        var computeStrongComponents = new ComputeStrongComponents();
        var strongComponentGraph = computeStrongComponents.compute(graphAssertions.subclassEdges, graphAssertions.namedClasses.length);
        var adjacencyList: number[][] = strongComponentGraph.adjacencyList;
        var components: number[][] = strongComponentGraph.components;
        var result = new ComponentGraph();

        for (var component of components) {
            var classesInCurrentComponent = component.map((x) => graphAssertions.namedClasses[x]);
            result.addComponent(new Component(classesInCurrentComponent));
        }

        for (var i = 0; i < adjacencyList.length; i++) {
            adjacencyList[i].forEach((x) => result.addSubclassEdge(i, x));
        }

        return result;
    }

    public compute() {
        var graphAssertions = this.extreactOntologyAsertions();
        var componentGraph = this.createComponentGraph(graphAssertions);
        return componentGraph;
    }
}