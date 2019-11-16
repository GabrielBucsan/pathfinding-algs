class Node{
    constructor(
        context,
        position,
        size
    ){
        this.position = position;
        this.size = size;
        this.c = context;

        this.passable = (Math.random() > 0.35);
        this.state = 'nVis';

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
        if(state == 'start' || state == 'end'){
            this.passable = true;
            this.state = state;
        }
        if(this.state != 'start' && this.state != 'end'){
            this.state = state;
        }
    }

    resetNode(){
        if(this.state != 'start')
            this.state = undefined;
        else
            this.state = 'nVis';

        this.parentNode = undefined;
        this.gCost = Infinity;
        this.hCost = Infinity;
    }

    draw(){
        let color;
        if(this.state == 'start'){
            color = '#fff421';
        }else if(this.state == 'end'){
            color = '#0000ff';
        }else if(this.state == 'path'){
            color = '#ff2626'
        }else if(this.state == 'vis'){
            color = 'rgba(209, 175, 243, 0.51)';
        }else{
            color = (this.passable)? '#323232' : '#000000';
        }
        if(color != '#323232'){
            this.c.fillStyle = color;
            this.c.fillRect(this.position.x * this.size, this.position.y * this.size, this.size, this.size);
        }
    }
}