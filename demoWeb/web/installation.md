# Instalace SPARQL editoru
SPARQL editor je distribuován formou javascriptové komponenty pro front-end prostředí, jejíž API je podrobně popsáno na [této stránce](./api.md). Pro instalaci SPARQL editoru na libovolný server je potřeba několika kroků:
* Zpřístupnění javascriptových zdrojových kódů editoru na serveru.
* Zpřístupnění popisu ontologie pro napovídání.
* Nahrání zdrojových kódů editoru do webového prohlížeče a inicializace komponenty SPARQL editoru s URL, na kterém leží popis ontologie pro napovídání.

## Závislosti editoru
SPARQL editor závisí na následujících knihovnách třetích stran:

*  [Monaco editor](https://microsoft.github.io/monaco-editor) - je webově založený editor zdrojových kódů poskytující API pro jazykovou podporu jako napovídání, zvýraznění syntaxe, atd. Pro svoji výbornou použitelnost se stal jádrem SPARQL editoru. 
* [RequireJS](http://requirejs.org) - knihovna věnující se načítání javascriptových modulů. Je potřebná pro fungování Monaco editoru.  

Bez výše zmíněných knihoven nebude SPARQL editor fungovat a je potřeba pro jeho instalaci nainstalovat i tyto knihovny.

## Konfigurace editoru
SPARQL editor je distribouván z hlediska konfigurace ve dvou variantách:

* **Debug** - verze vhodná pro ladění chyb. Zachovává názvy ve zdrojových kódech a je distribuována i se sourcemaps. 
* **Release** - verze vhodná pro produkční prostředí. Zdrojové kódy jsou "uglifikovány" a "minifikovány". 

## Stažení instalačního archivu
Pro instalaci SPARQL editoru je nejdříve potřeba stáhnout jeho [instalační archiv](sparql-editor.zip) (dostupný i na úvodní obrazovce). Součástí archivu je:
* `./sparqleditor` - debug a release verze SPARQL editoru. 
* `./editortool.js` - back-endový nástroj s názvem [EditorTool](./editortool.md) pro předpočítávání a poskytování ontologii pro SPARQL editor.
* `./monaco-editor` - zdrojové kódy pro instalaci [Monaco editoru](https://microsoft.github.io/monaco-editor)
* `./requirejs` - zdrojové kódy pro instalaci [RequireJS](http://requirejs.org/)

## Spuštění komponenty ve front-endu
Následující návod předvede jak spustit SPARQL editor ve webovém prohlížeči, za předpokladu, že na webovém serveru jsou dostupné zdrojových kódy SPARQL editoru, Monaco editoru a RequireJS. Jelikož se jedná o front-end prostředí následující ukázky se týkají HTML stránky, do které je SPARQL editor vkládán. 

Jako první krok je potřeba do webového prohlížeče načíst knihovnu RequireJS, která je součástí instalačního archivu, skrz následující kód:
```html
<script type="text/javascript" src="pathToRequireJS/require.js"></script>
```
Následně vytvoříme kontejner, ve kterém bude SPARQL editor vykreslován:
```html
<div id="editorContainer"></div>
```

Kontejner musí mít pevně specifikovanou výšku a šířku pomocí CSS vlastností. Toho lze docílit přidáním stylu:
```css        
#editorContainer {
    width: 100%;
    height: 600px;
    border: 1px solid #000000; // Vhodné vizuální ohraničení editoru
}
```   

Následně zbývá samotná inicializace SPARQL editoru pomocí javascriptu. Inicializace může vypadat například takto: 
```javascript
require(["pathToSparqlEditor/debug/sparqlEditor.js"], function (editorBundle) {
    var container = document.getElementById("editorContainer");
    var settings = {
        monacoEditorUrl: "../monaco-editor/min/vs",
        ontologySourceUrl: "http://localhost:8080/exampleOntology.ttl",
        ontologySourceType: "raw"
        defaultEditorValue: 'SELECT * FROM { }',
    };
    var editorComponent = new editorBundle.SparqlEditor(container, settings);
    editorComponent.init();
});
```

Pomocí funkce `require` z knihovny RequireJS se nahraje modul SPARQL editoru do webového prohlížeče. Moduly debug a release verze editoru lze najít v instalačním archivu, v tomto příkladu se nahraje modul debug verze z abstraktní URL `pathToSparqlEditor/debug/sparqlEditor.js`. V případě release verze by URL byla `pathToSparqlEditor/release/sparqlEditor.js`. Následně je SPARQL editor inicializován v již vytvořeném kontejneru s identifikátorem `editorContainer` pomocí funkce `init`. SPARQL editor má dvě povinná nastavení:
* `monacoEditorUrl` - musí obsahovat URL ke komponentě Monaco editoru, který je také součástí instalačního archivu.
* `ontologySourceUrl` - musí obsahovat URL k popisu ontologie, kterou má SPARQL editor napovídat. Silně doporučeným nastavením je `ontologySourceType`, které specifikuje typ ontologie na dříve popsaném URL.

Popis všech nastavení a jejich hodnot lze zobrazit [v popisu API](./api.md).