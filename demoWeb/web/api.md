# Sparql editor

### Seznam metod

| Název                   | Argumenty                                                           | Popis                                                      |
| ----------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------- |
| constructor             | (container: HTMLElement,sparqlEditorSettings: SparqlEditorSettings) | Vytvoří instanci sparql editoru.                           |
| init                    | ()                                                                  | Inicializuje editor uvnitř kontejneru                      |
| changeOntologySourceUrl | (ontologySourceUrl: string, ontologySourceType?:OntologySourceType) | Změní nastavení *ontologySourceUrl* a *ontologySourceType* |

### Seznam vlastností SparqlEditorSettings
| Název                    | Typ                  | Výchozí hodnota   | Popis                                                              |
| ------------------------ | -------------------- | ----------------- | ------------------------------------------------------------------ |
| monacoEditorUrl          | string               | Povinná vlastnost | URL zdrojových kódů  monaco editoru                                |
| ontologySourceUrl        | string               | Povinná vlastnost | URL souboru s popisem ontologie pro napovídání                     |
| ontologySourceType       | OntologySourceType   | "custom"          | Určuje formát souboru na *ontologySourceUrl*                       |
| propertySelectorType     | PropertySelectorType | "Restricted"      | XZY                                                                |
| languageTag              | string               | "en"              | Definuje tag jazyka jehož popisky (rdfs:label) se budou zobrazovat |
| defaultEditorValue       | string               | Prázdný string    | Výchozí hodnota textu v editoru                                    |
| saveEditorValueInCookies | boolean              | false             | Určuje zda se má hodnota textu v editoru ukládat do cookies        |
| isLoggingEnabled         | boolean              | false             | Určuje zda editor loguje informace o autocompletition do console   |
| logOntologyBuildError    | boolean              | false             | Určuje zda se chyby při parsování ontologie vypisují do console    |

### Popis výčtového typu OntologySourceType
* "custom",
* "raw" ,
* "precomputed"

### Popis výčtového typu PropertySelectorType
"Full"
"Restricted"