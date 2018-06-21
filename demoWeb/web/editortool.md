# Pomocný back-endový nástroj SPARQL editoru - EditorTool
EditorTool je nástroj určený pro back-end prostředí k předpočítávání autocompletion SPARQL editoru z ontologii ve formátu [turtle](https://www.w3.org/TR/turtle). Součástí nástroje i jednoduchý HTTP server umožnující poskytovat ontologie na zadaném portu. Zpracovat velké ontologie z turtle formátu může trvat dlouhou dobu, pro zkrácení této doby byl vytvořen tento nástroj, který zaprvé umožní předpočítání ontologii na serveru a zadruhé nemusí být přepočet pouštěn v případě používání stejné ontologie znovu. Předpočtené ontologie se ukládají v JSON souboru, který obsahuje data vhodná pro potřeby SPARQL editoru. Program je přizbůsoben pro spuštění z příkazové řádky a lze spustit pomocí technologie Node.js.

## Získání nástroje
EditorTool je součástí [instalačního archivu](sparql-editor.zip). Nástroj je zkompilováný do jediného souboru `editortool.js` a je spustitelný pomocí technologie Node.js.

## Popis rozraní
Přepočtení ontologii se provede příkazem:

```
node editortool.js precompute <sourceFile> <destinationFile>
```

Argument `sourceFile` musí být cesta k souboru ve formátu turtle obsahující popis ontologie. Argument `destinationFile` určuje soubor, do kterého program uloží předpočtenou ontologii ve formátu JSON. 

Přepočtenou ontologii či dokonce orignální ontologii v turtle je možné pomocí nástroje poskytovat na zadaném portu pomocí příkazu:

```
node editortool.js serve <port> <ontologyFormat> <ontologyFile>
```

Argument `port` určuje na jakém portu bude jednoduchý HTTP server naslouchat. Argumentem `ontologyFormat` musíme označit jaký formát má soubor s ontologii, který bude poskytovat. Formát může nabývat pouze dvou hodnot `raw` v případě turtle a `precomputed` v případě přepočtené ontologie. Argumentem `ontologyFile` se zadá cesta k souboru s ontologii.
