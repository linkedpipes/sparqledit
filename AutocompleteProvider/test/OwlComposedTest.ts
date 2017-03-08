import { OwlComposedSchema } from '../src/SchemaDefinition/OwlComposedSchema';
import * as chai from 'chai';
import * as fs from 'fs';
var rdf = require('rdf');


function readFile(file: string) {
    var fileContent = fs.readFileSync(file).toString();
    return fileContent;
}

describe('Owl pokus', () => {
    it('should do simple owl.', () => {
        var schemaProvider = new OwlComposedSchema(readFile(__dirname + '/ontologies/pizza.owl.ttl'));
        // var schemaProvider = new OwlComposedSchema(readFile(__dirname + '/ontologies/test.owl.ttl'));
        schemaProvider.doMagic();
    });

});