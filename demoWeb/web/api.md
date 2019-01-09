# API Komponenty SPARQL editoru
SPARQL editor je distribuován formou javascriptové komponenty pro front-end prostředí s následujícím API.

## Seznam metod
| Název                   | Argumenty                                                            | Popis                                                                     |
| ----------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| constructor             | (container: HTMLElement, sparqlEditorSettings: SparqlEditorSettings) | Vytvoří instanci sparql editoru.                                          |
| init                    | ()                                                                   | Inicializuje editor uvnitř kontejneru                                     |
| changeOntologySourceUrl | (ontologySourceUrl: string, ontologySourceType?:OntologySourceType)  | Změní nastavení *ontologySourceUrl* a při vyplnění i *ontologySourceType* |

## Seznam vlastností SparqlEditorSettings
| Název                             | Typ                    | Výchozí hodnota   | Popis                                                                   |
| --------------------------------- | ---------------------- | ----------------- | ----------------------------------------------------------------------- |
| monacoEditorUrl                   | string                 | Povinná vlastnost | URL zdrojových kódů  monaco editoru                                     |
| ontologySourceUrl                 | string                 | Povinná vlastnost | URL souboru s popisem ontologie pro napovídání                          |
| ontologySourceType                | OntologySourceType     | "custom"          | Určuje formát souboru na *ontologySourceUrl*                            |
| parentOntologyClassTracking       | "Full" or "Restricted" | "Full"            | Typ získávání otcovských tříd pro napovídání vlastností                 |
| adviseAtomicClassFromComplexClass | boolean                | false             | Určuje, zda přidat atomické třídy ze složených do napovídání vlastností |
| languageTag                       | string                 | "en"              | Definuje tag jazyka jehož popisky (rdfs:label) se budou zobrazovat      |
| defaultEditorValue                | string                 | Prázdný string    | Výchozí hodnota textu v editoru                                         |
| saveEditorValueInCookies          | boolean                | false             | Určuje, zda se má hodnota textu v editoru ukládat do cookies            |
| isLoggingEnabled                  | boolean                | false             | Určuje, zda editor loguje informace o autocompletition do konzole       |
| logOntologyBuildError             | boolean                | false             | Určuje, zda se chyby při parsování ontologie vypisují do konzole        |

## Typy popisu ontologii
SPARQL editor skrze vlastnosti `ontologySourceType` podporuje následující typy popisu ontologii:
* `raw` - ontologie popsaná ve formátu turtle
* `precomputed` - předpočítaná ontologie pomocí nástroje [EditorTool](./editortool.md)
* `custom` - formát, který je poskytován příkazem `serve` v nástroji [EditorTool](./editortool.md)