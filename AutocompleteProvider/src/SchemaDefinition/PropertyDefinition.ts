import { ClassDefinition } from './ClassDefinition';

export class PropertyDefinition {
    public label: string = "";

    constructor(public name: string, public domain: string, public range: string) {
        /* empty */
    }
}