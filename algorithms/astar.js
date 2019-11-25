class AStar{
    constructor(map, heuristic){
        this.map = map;
        this.selectedHeuristic = heuristic;

        this.nodeList = map.nodeList;
        this.start = map.startPosition;
        this.end = map.endPosition;
        this.mapSize = map.size;
    }

    run(){

        this.initializeAlgorithm();

        while (this.opened.heap.length > 0) {
            let step = this.step();
            if(step){
                return step;
            }
        }
        window.logger.displayMessage('A* algorithm was not able to find a solution for the given map.');
    }

    initializeAlgorithm(){
        window.logger.displayMessage('Starting A* algorithm execution...');
        window.logger.startTimer();
        this.opened = new BinaryHeap();
        this.closed = new Map();

        let startNodeIndex = this.map.getNodeIndex(this.start);
        this.nodeList[startNodeIndex].gCost = 0;
        this.nodeList[startNodeIndex].hCost = this.heuristic(this.nodeList[startNodeIndex]);

        this.opened.insert(startNodeIndex, this.nodeList[startNodeIndex].fCost());
    }

    step(){
        if(this.opened.heap.length == 0){
            window.logger.displayMessage('A* algorithm was not able to find a solution for the given map.');
            return [];
        }
        let currentNodeIndex = this.opened.extract().key;
        let currentNode = this.nodeList[currentNodeIndex];

        this.nodeList[currentNodeIndex].setState(NodeType.VIS);
        this.closed.set(currentNodeIndex, currentNodeIndex);

        if(!currentNode){
            window.logger.displayMessage('A* algorithm was not able to find a solution for the given map.');
            return [];
        }

        if(currentNode.position.x == this.end.x && currentNode.position.y == this.end.y) {
            window.logger.endTimer('A* finished in ');
            return this.reconstructPath(currentNode);
        }

        for (let i = 0; i < currentNode.neighbours.length; i++) {
            let neighbour = this.nodeList[currentNode.neighbours[i]];
            if(!neighbour.passable || this.closed.get(currentNode.neighbours[i])){
                continue;
            }

            let gCost = currentNode.gCost + currentNode.position.distance(neighbour.position);
            if(gCost < neighbour.gCost || !this.opened.contains(currentNode.neighbours[i])){
                this.nodeList[currentNode.neighbours[i]].gCost = gCost;
                this.nodeList[currentNode.neighbours[i]].hCost = this.heuristic(neighbour);
                this.nodeList[currentNode.neighbours[i]].parent = currentNode;
                
                if(!this.opened.contains(currentNode.neighbours[i])){
                    this.opened.insert(currentNode.neighbours[i], this.nodeList[currentNode.neighbours[i]].fCost());
                    this.nodeList[currentNode.neighbours[i]].setState(NodeType.OPN);
                }else{
                    this.nodeList[currentNode.neighbours[i]].setState(NodeType.VIS);
                }
            }
        }
    }

    reconstructPath(endNode){
        this.clearOpenedStates();
        let path = [];
        let parentNode = endNode.parent;
        path.push(parentNode);
        while(parentNode){
            parentNode = parentNode.parent;
            if(parentNode) path.push(parentNode);
        }
        return path;
    }

    clearOpenedStates(){
        if(this.opened.heap.length > 0){
            for (let i = 0; i < this.opened.heap.length; i++) {
                this.nodeList[this.opened.heap[i].key].setState();
            }
        }
    }

    heuristic(node){
        if(this.selectedHeuristic == 'E'){
            return this.euclidian(node);
        }else if(this.selectedHeuristic == 'M'){
            return this.manhattan(node);
        }
    }

    euclidian(node){
        let difX = node.position.x - this.end.x;
        let difY = node.position.y - this.end.y;
        return Math.sqrt(difX * difX + difY * difY);
    }

    manhattan(node){
        let difX = Math.abs(node.position.x - this.end.x);
        let difY = Math.abs(node.position.y - this.end.y);
        return difX + difY;
    }
}