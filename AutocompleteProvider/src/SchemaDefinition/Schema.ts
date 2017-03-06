import { ClassDefinition } from './ClassDefinition';

export class Schema {
    constructor(public classes: ClassDefinition[]) {
    }

    getClass(className: string) {
        var matchedClasses = this.classes.filter(x => x.name == className);
        if (matchedClasses.length == 0) {
            return null;
        }
        return matchedClasses[0];
    }
}