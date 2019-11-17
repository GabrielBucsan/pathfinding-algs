class Node{
    constructor(
        context,
        position,
        size,
        passable
    ){
        this.position = position;
        this.size = size;
        this.c = context;
        this.passable = passable;

        this.state = NodeType.NVIS;

        this.parentNode = undefined;
        this.gCost = Infinity;
        this.hCost = Infinity;
    }

    fCost(){
        return this.gCost + this.hCost;
    }

    setNeighbours(neighbours){
        this.neighbours = neighbours;
    }

    setState(state){
        if(state == NodeType.START || state == NodeType.END){
            this.passable = true;
            this.state = state;
        }
        if(this.state != NodeType.START && this.state != NodeType.END){
            this.state = state;
        }
    }

    resetNode(){
        this.state = undefined;
        this.parent = undefined;
        this.gCost = Infinity;
        this.hCost = Infinity;
    }

    draw(){
        let color;
        if(this.state == NodeType.START){
            color = '#fff421';
        }else if(this.state == NodeType.END){
            color = '#0000ff';
        }else if(this.state == NodeType.PATH){
            color = '#ff2626'
        }else if(this.state == NodeType.VIS){
            color = 'rgba(0, 214, 185, 0.48)';
        }else{
            color = (this.passable)? '#323232' : '#000000';
        }
        if(color != '#323232'){
            this.c.fillStyle = color;
            this.c.fillRect(this.position.x * this.size, this.position.y * this.size, this.size, this.size);
        }
    }
}