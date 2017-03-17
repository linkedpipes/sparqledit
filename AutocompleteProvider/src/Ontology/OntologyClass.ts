export interface IOntologyClass {
    getText(): string;
}

export class UnknownClass implements IOntologyClass {

    constructor(public nodeValue: string) {

    }

    getText() {
        return 'Unknown(' + this.nodeValue + ')';
    }
}

export class AtomicClass implements IOntologyClass {

    constructor(public iri: string) {

    }

    getText() {
        return 'Atomic(' + this.iri + ')';
    }
}

export class RestrictionClass implements IOntologyClass {

    constructor(public onProperty: string) {

    }

    getText() {
        return 'RestrictionOn(' + this.onProperty + ')';
    }
}

export class IntersectionClass implements IOntologyClass {

    public classes: IOntologyClass[] = [];

    addClass(schemaClass: IOntologyClass) {
        this.classes.push(schemaClass);
        return this;
    }
    getText() {
        return 'Intersection(' + this.classes.map(x => x.getText()).join(', ') + ')';
    }

}

export class UnionClass implements IOntologyClass {

    public classes: IOntologyClass[] = [];

    addClass(schemaClass: IOntologyClass) {
        this.classes.push(schemaClass);
        return this;
    }

    public getText() {
        return 'Union(' + this.classes.map(x => x.getText()).join(', ') + ')';
    }
}