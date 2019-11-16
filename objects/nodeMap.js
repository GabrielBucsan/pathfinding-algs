class NodeMap{
    constructor(context, size, nodeSize){
        this.size = size;
        this.c = context;

        this.nodeList = [];
        this.nodeSize = nodeSize;
        this.startPosition = new Vector(
            Math.floor(Math.random() * this.size.x), 
            Math.floor(Math.random() * this.size.y));

        this.endPosition;
        do {
            this.endPosition = new Vector(
                        Math.floor(Math.random() * this.size.x), 
                        Math.floor(Math.random() * this.size.y));
        } while (this.endPosition.x != this.startPosition.x && this.endPosition.y != this.startPosition.y);

        this.initializeMap();
    }

    initializeMap(){
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                this.nodeList.push(new Node(this.c, new Vector(x, y), this.nodeSize));
            }
        }
    
        for (let i = 0; i < this.nodeList.length; i++) {
            let neighbours = [];
            for (let y = -1; y <= 1; y++) {
                for (let x = -1; x <= 1; x++) {
                    let neighbourPosition = new Vector(
                        this.nodeList[i].position.x + x,
                        this.nodeList[i].position.y + y
                    );
                    if(x == 0 && y == 0) continue;
                    if(x != 0 && y != 0) continue;
                    let neighbour = this.getNodeAt(neighbourPosition);
                    if(neighbour) neighbours.push(this.getNodeIndex(neighbourPosition));
                }
            }
            this.nodeList[i].setNeighbours(neighbours);
        }
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
}