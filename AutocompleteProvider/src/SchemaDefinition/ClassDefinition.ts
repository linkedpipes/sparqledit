import { PropertyDefinition } from './PropertyDefinition';

export class ClassDefinition {
    public label: string;

    constructor(public name: string, public properties: PropertyDefinition[]) {

    }

    getPropertyNames() {
        return this.properties.map(x => x.name);
    }

    getProperty(name: string) {
        var properties = this.properties.filter(x => x.name == name);
        var length = properties.length;
        if (length > 1) {
            throw new Error();
        }
        if (length == 0) {
            return null;
        }
        return properties[0];
    }
}