import { Schema } from '../SchemaDefinition/Schema';

export interface ISchemaProvider {
    getSchema(): Schema;
}