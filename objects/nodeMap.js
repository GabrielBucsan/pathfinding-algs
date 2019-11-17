class NodeMap{
    constructor(context, size, nodeSize, mapType){
        this.size = size;
        this.c = context;

        this.nodeList = [];
        this.nodeSize = nodeSize;

        this.buildMap(mapType);
    }

    randomMap(){
        window.logger.startTimer();
        this.nodeList = [];
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                let passable = Math.random() > 0.35;
                if(x == 0 || x == this.size.x - 1 || y == 0 || y == this.size.y - 1){
                    passable = false;
                }
                this.nodeList.push(new Node(this.c, new Vector(x, y), this.nodeSize, passable));
            }
        }
    
        for (let i = 0; i < this.nodeList.length; i++) {
            let neighbours = [];
            for (let y = -1; y <= 1; y++) {
                for (let x = -1; x <= 1; x++) {
                    if(x == 0 && y == 0) continue;
                    if(x != 0 && y != 0) continue;
                    let neighbourPosition = new Vector(
                        this.nodeList[i].position.x + x,
                        this.nodeList[i].position.y + y
                    );
                    let neighbour = this.getNodeAt(neighbourPosition);
                    if(neighbour) neighbours.push(this.getNodeIndex(neighbourPosition));
                }
            }
            this.nodeList[i].setNeighbours(neighbours);
        }
        window.logger.endTimer('Random map generated in');
    }

    recursiveBacktrackingMap(){
        window.logger.startTimer();
        this.nodeList = [];
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                let sx = x % 2 == 0;
                let sy = y % 2 == 0;
                let passable = false;
                if(!sx && !sy){
                    passable = true;
                }
                if(x == 0 || x == this.size.x - 1 || y == 0 || y == this.size.y - 1){
                    passable = false;
                }
                this.nodeList.push(new Node(this.c, new Vector(x, y), this.nodeSize, passable));
            }
        }

        for (let i = 0; i < this.nodeList.length; i++) {
            let neighbours = [];
            for (let y = -1; y <= 1; y++) {
                for (let x = -1; x <= 1; x++) {
                    if(x == 0 && y == 0) continue;
                    if(x != 0 && y != 0) continue;
                    let neighbourPosition = new Vector(
                        this.nodeList[i].position.x + x,
                        this.nodeList[i].position.y + y
                    );
                    let neighbour = this.getNodeAt(neighbourPosition);
                    if(neighbour) neighbours.push(this.getNodeIndex(neighbourPosition));
                }
            }
            this.nodeList[i].setNeighbours(neighbours);
        }

        let currentNode = this.nodeList[this.getNodeIndex(new Vector(1))];
        let stack = [];
        let visited = [];

        stack.push(currentNode);
        visited.push(currentNode);
        this.nodeList[this.getNodeIndex(currentNode.position)].passable = true;

        while (stack.length > 0) {
            let neighbours = [];
            for (let y = -2; y <= 2; y+=2) {
                for (let x = -2; x <= 2; x+=2) {
                    if(x == 0 && y == 0) continue;
                    if(x != 0 && y != 0) continue;
                    let neighbourPosition = new Vector(
                        currentNode.position.x + x,
                        currentNode.position.y + y
                    );
                    let neighbour = this.getNodeAt(neighbourPosition);
                    if(neighbour && !visited.includes(neighbour)) {
                        neighbours.push(neighbour);
                    }
                }
            }

            if(neighbours.length > 0){
                let neighbour = neighbours[Math.floor(Math.random() * (neighbours.length))];
                stack.push(neighbour);
                visited.push(neighbour);
                this.nodeList[this.getNodeIndex(neighbour.position)].passable = true;
                if(neighbour.position.x > currentNode.position.x){
                    this.nodeList[this.getNodeIndex(new Vector(neighbour.position.x - 1, neighbour.position.y))].passable = true;
                }else if(neighbour.position.x < currentNode.position.x){
                    this.nodeList[this.getNodeIndex(new Vector(neighbour.position.x + 1, neighbour.position.y))].passable = true;
                }else if(neighbour.position.y > currentNode.position.y){
                    this.nodeList[this.getNodeIndex(new Vector(neighbour.position.x, neighbour.position.y - 1))].passable = true;
                }else if(neighbour.position.y < currentNode.position.y){
                    this.nodeList[this.getNodeIndex(new Vector(neighbour.position.x, neighbour.position.y + 1))].passable = true;
                }
                currentNode = neighbour;
            }else{
                currentNode = stack.pop();
            }
        };
        window.logger.endTimer('Recursive Backtracking map generated in');
    }

    buildMap(mapType){
        this.startPosition = this.generatePoint();

        this.endPosition;
        do {
            this.endPosition = this.generatePoint();
        } while (this.endPosition.x == this.startPosition.x && this.endPosition.y == this.startPosition.y);
        
        if(mapType == 'R'){
            this.randomMap();
        }else if(mapType == 'B'){
            this.recursiveBacktrackingMap();
        }
        this.nodeList[this.getNodeIndex(this.startPosition)].setState(NodeType.START);
        this.nodeList[this.getNodeIndex(this.endPosition)].setState(NodeType.END);
    }

    renderMap(){
        for (let i = 0; i < this.nodeList.length; i++) {
            this.nodeList[i].draw();
        }
    }

    getNodeIndex(position){
        return position.y * this.size.x + position.x
    }

    getNodeAt(position){
        if(position.x < 0 || position.x >= this.size.x){
            return;
        }
        if(position.y < 0 || position.y >= this.size.y){
            return;
        }
        return this.nodeList[this.getNodeIndex(position)];
    }

    resetMap(){
        for (let i = 0; i < this.nodeList.length; i++) {
            this.nodeList[i].resetNode();
        }
        this.nodeList[this.getNodeIndex(this.startPosition)].setState(NodeType.START);
        this.nodeList[this.getNodeIndex(this.endPosition)].setState(NodeType.END);
    }

    setPath(path){
        for (let i = 0; i < path.length; i++) {
            let index = this.getNodeIndex(path[i].position);
            this.nodeList[index].setState(NodeType.PATH);
        }
    }

    generatePoint(){
        return new Vector(
            Math.floor(Math.random() * (this.size.x - 1)), 
            Math.floor(Math.random() * (this.size.y - 1)));
    }

    generateEdgePoint(){
        if(Math.random() > 0.5){
            return new Vector(
                Math.floor(Math.random() * (this.size.x - 1)), 
                (Math.random() > 0.5)? 0 : (this.size.y - 1));
        }else{
            return new Vector(
                (Math.random() > 0.5)? 0 : (this.size.x - 1), 
                Math.floor(Math.random() * (this.size.y - 1)));
        }
    }
}