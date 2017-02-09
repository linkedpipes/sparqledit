import { PropertyDefinition } from './PropertyDefinition';

export class ClassDefinition {
    public label: string;

    constructor(public name: string, public properties: PropertyDefinition[]) {

    }
}