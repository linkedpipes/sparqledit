export interface IOntologyClass {
    getText(): string
    equal(ontologyClass: IOntologyClass): boolean
}

export class UnknownClass implements IOntologyClass {

    constructor(public nodeValue: string) {

    }

    public getText() {
        return 'Unknown(' + this.nodeValue + ')';
    }

    public equal(ontologyClass: IOntologyClass): boolean {
        return (ontologyClass instanceof UnknownClass) && this.nodeValue == (<UnknownClass>ontologyClass).nodeValue;
    }
}

export class AtomicClass implements IOntologyClass {

    constructor(public iri: string) {

    }

    public getText() {
        return 'Atomic(' + this.iri + ')';
    }

    public equal(ontologyClass: IOntologyClass): boolean {
        return (ontologyClass instanceof AtomicClass) && this.iri == (<AtomicClass>ontologyClass).iri;
    }
}

export class RestrictionClass implements IOntologyClass {
    constructor(public onProperty: string) {

    }

    public getText() {
        return 'RestrictionOn(' + this.onProperty + ')';
    }

    equal(ontologyClass: IOntologyClass): boolean {
        return (ontologyClass instanceof RestrictionClass) && this.onProperty == (<RestrictionClass>ontologyClass).onProperty;
    }

}

abstract class ListClass implements IOntologyClass {

    public classes: IOntologyClass[] = [];

    private areClassSetsEqual(firstClasses: IOntologyClass[], secondClasses: IOntologyClass[]): boolean {
        // Under asumptions that does not contain duplicities
        if (firstClasses.length != secondClasses.length) {
            return false;
        }

        for (var firstClass of firstClasses) {
            if (!secondClasses.some(x => x.equal(firstClass))) {
                return false;
            }
        }

        return true;
    }

    protected getClassesText() {
        return this.classes.map(x => x.getText()).join(', ');
    }

    protected equalGeneric<T extends ListClass>(ontologyClass: IOntologyClass, type: { new (): T }): boolean {
        if (!(ontologyClass instanceof type)) {
            return false;
        }

        var firstClasses = this.classes;
        var secondClasses = (<T>ontologyClass).classes;
        return this.areClassSetsEqual(firstClasses, secondClasses);
    }

    public addClass(ontologyClass: IOntologyClass) {
        if (this.classes.some(x => x.equal(ontologyClass))) {
            return this;
        }
        this.classes.push(ontologyClass);
        return this;
    }

    public abstract getText(): string;

    public abstract equal(ontologyClass: IOntologyClass): boolean
}

export class IntersectionClass extends ListClass {

    public getText(): string {
        return 'IntersectionOf(' + this.getClassesText() + ')';
    }

    public equal(ontologyClass: IOntologyClass): boolean {
        return this.equalGeneric(ontologyClass, IntersectionClass);
    }
}

export class UnionClass extends ListClass {
    public getText(): string {
        return 'UnionOf(' + this.getClassesText() + ')';
    }

    public equal(ontologyClass: IOntologyClass): boolean {
        return this.equalGeneric(ontologyClass, UnionClass);
    }
}