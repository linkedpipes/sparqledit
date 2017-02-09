import * as chai from 'chai';
import * as fs from 'fs';
import * as N3 from 'n3';

var rdf = require('rdf');

function getExampleTurtleContent() {
    var exampleTurtleContent = fs.readFileSync(__dirname + '/turtleSchemas/example.ttl').toString();
    return exampleTurtleContent;
}

function wait(ms:any){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}


// describe("Just examples", () => {
//     it("rdf.", function () {
//         var exampleTurtleContent = getExampleTurtleContent();
//         var environment = new rdf.RDFEnvironment();
//         var turtleParser = new rdf.TurtleParser(environment);
//         try {
//             turtleParser.parse(exampleTurtleContent, (graph: any) => {
//                 console.log(graph);
//             });
//         }
//         catch (e) {
//             console.log(e);
//         }
//         console.log(exampleTurtleContent);
//     })

//     it("n3", () => {
//         var exampleTurtleContent = getExampleTurtleContent();
//         var parser = N3.Parser();
//         parser.parse(exampleTurtleContent,
//             function (error, triple, prefixes) {
//                 if (triple)
//                     console.log(triple.subject, triple.predicate, triple.object, '.');
//                 else
//                     console.log("# That's all, folks!", prefixes)
//             });
//     });
// })