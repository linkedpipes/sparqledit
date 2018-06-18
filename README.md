# SPARQL editor
[SPARQL](https://www.w3.org/TR/sparql11-query) je dotazovací jazyk nad [RDF](https://www.w3.org/RDF). Tento projekt obsahuje webový sparql editor s podporou automatického doplňování pomocí ontologii specifikované zkrze [RDF Schema](https://www.w3.org/TR/rdf-schema) a částečně [OWL](https://www.w3.org/TR/owl2-rdf-based-semantics). Editor je určen pro webové prostředí běží jen pomocí HTML, CSS a JS. 

# Popis struktury projektu
Editor se skládá s několika propojených modulů. Pro snadné requirování modulů navzájem, jsou jednotlivé moduly uloženy ve složce "node_modules". Je pak možné  moduly requirovat napřímo, např. "require('ersparser')". Konkrétně se jedná o moduly:

* **ERSParser (Extended recoverable SPARQL parser)** - SPARQL Parser rozšířený o možnost zotavení se chyby v SPARQL dotazu.
* **SparqlAutocompletion** - knihovna obsahující třídy pro napovídání u SPARQL dotazů z ontologii a jejich parsování.
* **EditorComponent** - samotná komponenta SPARQL editoru pro použití ve webovém prohlížeči.
* **EditorTool** - CLI modul umožňující zpracování ontologii na backendu nebo vytvoření jednoduchého serveru poskytující ontologii pro editor.

# Spuštění projektu
SPRAQL editor je dockerizovaný, nejjednodušší spouštění projektu se provede přes sestavení lokálního Dockerfile a jeho následné spuštění.

```bash
docker build . -t sparqleditor
docker run --rm -it -p -p 8080:8080 sparqleditor
```

Alternativná variantou je spuštění přes online demo ze služby DockerHub:

```bash
docker run --rm -it -p 8080:8080 roucekmar/sparqleditor
```

Tento image je speciálně upravený pro demonstraci projektu a návodu na jeho instalaci, zdrojové kody image jsou ve složce `./demoDocker`.