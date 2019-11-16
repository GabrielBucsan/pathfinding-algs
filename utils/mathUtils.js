class Vector{
    constructor(x, y){
        if(x === undefined && y === undefined){
            this.x = 0;
            this.y = 0;
        }else if(y === undefined){
            this.x = x;
            this.y = x;
        }else{
            this.x = x;
            this.y = y;
        }
    }

    add(vector){
        this.x += vector.x;
        this.y += vector.y;
    }

    subtract(vector){
        this.x -= vector.x;
        this.y -= vector.y;
    }

    distance(vector){
        return Math.abs(Math.sqrt((this.x - vector.x)*(this.x - vector.x) + (this.y - vector.y)*(this.y - vector.y)));
    }

    multiplyVector(number){
        this.x *= number;
        this.y *= number;
    }

    divideVector(number){
        this.x /= number;
        this.y /= number;
    }

    limitMagnitude(max){
        let currMag = Math.sqrt(this.x * this.x + this.y * this.y);
        if(currMag > max){
            this.divideVector(currMag);
            this.multiplyVector(max);
        }
    }

    direction(){
        let aux = Math.atan2(this.y, this.x);
        if(aux < 0) aux += 2 * Math.PI;
        return aux
    }

    static random(){
        return new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
    }

    static randomBetween(min, max){
        return new Vector(
            Math.floor(Math.random() * (max - min + 1) + min),
            Math.floor(Math.random() * (max - min + 1) + min)
        );
    }

    static subtract(vector1, vector2){
        return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
    }
}

class Rectangle{
    constructor(pos, size){
        this.position = pos;
        this.size = size;
    }

    containsPoint(point){
        return (point.x >= this.position.x &&
                point.y >= this.position.y &&
                point.x <= this.position.x + this.size.x &&
                point.y <= this.position.y + this.size.y)
    }

    intersects(form){
        // it's a circle!
        if(form.radius){
            return (this.containsPoint(form.position) ||
                    form.containsPoint(new Vector(this.position.x, this.position.y)) ||
                    form.containsPoint(new Vector(this.position.x + this.size.x, this.position.y)) ||
                    form.containsPoint(new Vector(this.position.x, this.position.y + this.size.y)) ||
                    form.containsPoint(new Vector(this.position.x + this.size.x, this.position.y + this.size.y)));
        }
    }
}

class Circle{
    constructor(pos, rad){
        this.position = pos;
        this.radius = rad;
    }

    containsPoint(point){
        let x = point.x - this.position.x;
        let y = point.y - this.position.y;
        return ((x*x) + (y*y)) <= this.radius * this.radius;
    }
}