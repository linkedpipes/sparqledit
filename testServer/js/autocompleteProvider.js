function createDependencyProposals() {
    // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
    // here you could do a server side lookup
    return [
        {
            label: '"label"',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: '"DOc"',
            insertText: 'label',
            detail: '"detail"',
            filterText: 'bagr',
            sortText: "1"
        },
        {
            label: '"ns:jead"',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: "Fast, unopinionated, minimalist web framework",
            insertText: '"express": "*"',
            sortText: "2"
        },
        {
            label: '"ns:dva"',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: "Fast, unopinionated, minimalist web framework",
            insertText: '"express": "*"',
            sortText: "3"
        },
        {
            label: '"express"',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: "Fast, unopinionated, minimalist web framework",
            insertText: '"express": "*"',
            sortText: "4"
        },
        {
            label: '"mkdirp"',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: "Recursively mkdir, like <code>mkdir -p</code>",
            insertText: '"mkdirp": "*"',
            sortText: "5"
        },
        {
            label: '"lodash"',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: '"lodash": "*"',
            sortText: "6"
        },
    ];
}

function provideSparqlCompletionItems(model, position) {
    console.log(model.getOffsetAt(position));
    return createDependencyProposals();
}