function getItemSetReferences(itemSets, id) {
    var result = itemSets
        .filter(function (x) {
            return _.contains(x.Transitions, id);
        })
        .map(function (x) {
            return x.Id;
        });
    return result;
}


function createSymbolTable(parser) {
    var oldSymbols = parser.symbols_;
    var newSymbols = [];
    Object.keys(oldSymbols).forEach(
        function (x) {
            newSymbols[oldSymbols[x]] = x;
        }
    );
    return newSymbols;
}

function mapTable(parser) {
    var table = parser.table;
    var symbolTable = createSymbolTable(parser);
    var newTable = {};
    Object.keys(table).forEach(function (rowId) {
        var row = table[rowId];
        var newRow = Object.keys(row).map(function (key) {
            var action = row[key];
            var symbol = symbolTable[key];
            if (typeof action == 'number') {
                return {
                    actionType: 'goto',
                    symbol: symbol,
                    state: action,
                };
            }

            if (action[0] == 1) {
                return {
                    actionType: 'shift',
                    symbol: symbol,
                    state: action[1]
                };
            }
            else if (action == 3) {
                return {
                    actionType: 'shift',
                    symbol: symbol,
                    state: 'accept'
                };
            }

            var productionId = action[1];
            var production = parser.productions_[productionId];
            return {
                actionType: 'reduce',
                symbol: symbol,
                production: productionId == 0 ? 'accept' : symbolTable[production[0]]
            };
        });
        newTable[rowId] = newRow;
    });
    return newTable;
}

function parserVisualiser(parser) {
    var result = {};
    result.itemSets = parser.itemSets;
    result.table = mapTable(parser);
    return result;
}