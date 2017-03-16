import {Schema} from '../SchemaDefinition/Schema';
import {ISchemaProvider} from './ISchemaProvider';

export class SchemaProvider implements ISchemaProvider {
    getSchema(){
        var exampleSchema = new Schema();
        return exampleSchema; 
    }
}