import {TurtleSchemaProvider} from '../src/SchemaProvider/TurtleSchemaProvider';
import * as chai from 'chai';
import * as fs from 'fs';

function getExampleTurtleContent() {
    var exampleTurtleContent = fs.readFileSync(__dirname + '/turtleSchemas/example.ttl').toString();
    return exampleTurtleContent;
}

describe("TurtleSchemaProvider", () => {
    it("should parse simple turtle schema.", () => {
        var schemaProvider = new TurtleSchemaProvider(getExampleTurtleContent());
        var schema = schemaProvider.getSchema();
    });
})