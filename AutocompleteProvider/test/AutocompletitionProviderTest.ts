import { NodeType, Block, AutocompleteProvider } from '../src/Autocompletition/AutocompletitionProvider';
import { TurtleSchemaProvider } from '../src/SchemaProvider/TurtleSchemaProvider';
import * as chai from 'chai';
import * as fs from 'fs';
var ERSParser = require('../../../ERSParser/bin/ERSParser');
var rdf = require('rdf');

function readFile(file: string) {
    var fileContent = fs.readFileSync(file).toString();
    return fileContent;
}

function parseQueryFromFile(file: string) {
    var queryContent = readFile(file);
    var parser = new ERSParser();
    return parser.parse(queryContent);
}

describe('AutocompleteProvider', () => {
    it('should do simple autocomplettion', () => {
        var schemaProvider = new TurtleSchemaProvider(readFile(__dirname + '/autocompleteData/schema.ttl'));
        var schema = schemaProvider.getSchema();
        var autocompleteProvider = new AutocompleteProvider(schema);
        var query = parseQueryFromFile(__dirname + '/autocompleteData/query.sparql');
        autocompleteProvider.doAutocomplete(query);
    })
    describe('Block', () => {
        it('should parse different kinds of nodes.', () => {
            var query: any = parseQueryFromFile(__dirname + '/autocompleteData/queryBlock.sparql');
            var block = new Block(query.where[0].triples);

            var objects = block.triples.map(x =>
                ({
                    type: NodeType[x.object.type],
                    value: x.object.value
                }));
        })
    });
})