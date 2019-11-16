class Dijkstra{
    constructor(map){
        this.map = map;

        this.nodeList = map.nodeList;
        this.start = map.startPosition;
        this.end = map.endPosition;
        this.mapSize = map.size;
    }

    run(){
        this.opened = [];
        this.closed = [];

        let startNodeIndex = this.map.getNodeIndex(this.start);
        this.nodeList[startNodeIndex].gCost = 0;

        this.opened.push(this.nodeList[startNodeIndex]);

        while (this.opened.length > 0) {
            let currentNodeIndex = this.getIndexLowestCost();
            let currentNode = this.opened[currentNodeIndex];

            this.opened.splice(currentNodeIndex, 1);
            this.closed.push(currentNode);

            if(currentNode.position.x == this.end.x && currentNode.position.y == this.end.y) return this.reconstructPath(currentNode);

            for (let i = 0; i < currentNode.neighbours.length; i++) {
                let neighbour = this.nodeList[currentNode.neighbours[i]];

                if(!neighbour.passable || this.closed.includes(neighbour)){
                    continue;
                }

                let gCost = currentNode.gCost + currentNode.position.distance(neighbour.position);
                if(gCost < neighbour.gCost){
                    this.nodeList[currentNode.neighbours[i]].setState(NodeType.VIS);
                    this.nodeList[currentNode.neighbours[i]].gCost = gCost;
                    this.nodeList[currentNode.neighbours[i]].parent = currentNode;
                    
                    if(!this.opened.includes(neighbour)){
                        this.opened.push(this.nodeList[currentNode.neighbours[i]]);
                    }                    
                }
            }
        }
        return null;
    }

    reconstructPath(endNode){
        let path = [];
        let parentNode = endNode.parent;
        path.push(parentNode);
        while(parentNode){
            parentNode = parentNode.parent;
            if(parentNode) path.push(parentNode);
        }
        return path;
    }

    getIndexLowestCost(){
        let lowestCost = Infinity;
        let nodeIndex;
        for (let i = 0; i < this.opened.length; i++) {
            if(this.opened[i].gCost < lowestCost){
                lowestCost = this.opened[i].gCost;
                nodeIndex = i;
            }
        }
        return nodeIndex;
    }
}