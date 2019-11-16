class Canvas{
    constructor (x, y){
        this.canvas = $('canvas')[0];

        if(x === undefined && y === undefined){
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }else if(y === undefined){
            this.canvas.width = x;
            this.canvas.height = x;
        }else{
            this.canvas.width = x;
            this.canvas.height = y;
        }

        this.size = new Vector(this.canvas.width, this.canvas.height);
        this.context = this.canvas.getContext('2d', { alpha: false });
        this.color = '#323232';
    }

    update(pos, size){
        if(pos != undefined && size != undefined){
            this.context.clearRect(pos.x, pos.y, size.x, size.y);
        }else{
            this.context.clearRect(0, 0, this.size.x, this.size.y);
        }
        this.context.fillStyle = this.color;
        this.context.fillRect(0, 0, this.size.x, this.size.y);
    }

    background(color){
        this.color = color;
    }
}