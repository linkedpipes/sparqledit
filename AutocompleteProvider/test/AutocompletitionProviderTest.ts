import { TurtleGraphWrapper } from '../src/GraphTools/TurtleGraphWrapper';
import { OntologyHiearchyBuilder } from '../src/Ontology/Algorithms/OntologyHiearchyBuilder';
import { OntologyAssertionsBuilder } from '../src/Ontology/Algorithms/OntologyAssertionBuilder';
import { NodeType, Block, AutocompleteProvider } from '../src/Autocompletition/AutocompletitionProvider';
import * as chai from 'chai';
import * as fs from 'fs';
var ERSParser = require('../../../ERSParser/bin/ERSParser');
var rdf = require('rdf');

var ontologyAssertionsBuilder = new OntologyAssertionsBuilder();
var ontologyHiarchyBuilder = new OntologyHiearchyBuilder();

function readFile(file: string) {
    var fileContent = fs.readFileSync(file).toString();
    return fileContent;
}

function parseQueryFromFile(file: string) {
    var queryContent = readFile(file);
    var parser = new ERSParser();
    return parser.parse(queryContent);
}

function createOntologyHiearchyFromFile(fileName: string) {
    var fileContent = readFile(fileName);
    var ontologyAssertions = ontologyAssertionsBuilder.buildOntologyAsertions(new TurtleGraphWrapper(fileContent));
    var ontologyHiearchy = ontologyHiarchyBuilder.createOntologyHiearchy(ontologyAssertions);
    return ontologyHiearchy;
}

describe('AutocompleteProvider', () => {
    it('should do simple autocomplettion', () => {
        var ontologyHierachy = createOntologyHiearchyFromFile(__dirname + '/autocompleteData/schema.ttl');
        var autocompleteProvider = new AutocompleteProvider(ontologyHierachy);
        var query = parseQueryFromFile(__dirname + '/autocompleteData/query.sparql');
        var autocompleteResult = autocompleteProvider.doAutocomplete(query);
        var end = '';
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