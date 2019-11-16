class Node{
    constructor(
        context,
        position,
        size
    ){
        this.position = position;
        this.size = size;
        this.c = context;

        this.passable = (Math.random() > 0.4);
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
        }
        if(this.state != 'start' && this.state != 'end'){
            this.state = state;
        }
    }

    draw(){
        if(this.state == 'start'){
            this.c.fillStyle = '#00ff00';
        }else if(this.state == 'end'){
            this.c.fillStyle = '#0000ff';
        }else if(this.state == 'path'){
            this.c.fillStyle = '#ffff00'
        }else if(this.state == 'vis'){
            this.c.fillStyle = '#ff0000';
        }else{
            this.c.fillStyle = (this.passable)? '#ffffff' : '#000000';
        }
        this.c.fillRect(this.position.x * this.size, this.position.y * this.size, this.size, this.size);
    }
}