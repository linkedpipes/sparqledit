export function saveGraph(content: string) {
    var fs = require('fs');
    fs.writeFileSync('C:/Users/martin/Desktop/graph.txt', content)
}

export class VisGraph {
    public nodes: { id: number, label: string }[];
    public edges: { from: number, to: number }[];

    public serialize() {
        return JSON.stringify(this);
    }
}