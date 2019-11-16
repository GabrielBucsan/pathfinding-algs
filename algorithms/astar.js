class aStar{
    constructor(nodeList, startPoint, destinationPoint, mapSize){
        this.nodeList = nodeList;
        this.start = startPoint;
        this.end = destinationPoint;
        this.mapSize = mapSize;
    }

    run(){
        this.opened = [];
        this.closed = [];

        let startNodeIndex = this.getNodeIndex(this.start);
        this.nodeList[startNodeIndex].gCost = 0;
        this.nodeList[startNodeIndex].hCost = this.getHCost(this.nodeList[startNodeIndex]);

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
                    this.nodeList[currentNode.neighbours[i]].setState('vis');
                    this.nodeList[currentNode.neighbours[i]].gCost = gCost;
                    this.nodeList[currentNode.neighbours[i]].hCost = this.getHCost(neighbour);
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

    getHCost(node){
        let difX = this.end.x - node.position.x;
        let difY = this.end.y - node.position.y;
        return Math.sqrt(difX * difX + difY * difY);
    }

    getIndexLowestCost(){
        let lowestCost = Infinity;
        let nodeIndex;
        for (let i = 0; i < this.opened.length; i++) {
            if(this.opened[i].fCost() < lowestCost){
                lowestCost = this.opened[i].fCost();
                nodeIndex = i;
            }
        }
        return nodeIndex;
    }

    getNodeIndex(position){
        return position.y * this.mapSize.x + position.x
    }

    getNodeAt(position){
        if(position.x < 0 || position.x >= this.mapSize.x){
            return;
        }
        if(position.y < 0 || position.y >= this.mapSize.y){
            return;
        }
        return this.nodeList[getNodeIndex(position)];
    }
}