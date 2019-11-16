$(document).ready(()=>{
    
    const nodeSize = 5;
    const mapSize = new Vector(300, 100);
    const nodeList = [];
    const startPosition = new Vector(
                            Math.floor(Math.random() * mapSize.x), 
                            Math.floor(Math.random() * mapSize.y));

    let endPosition;
    do {
        endPosition = new Vector(
            Math.floor(Math.random() * mapSize.x), 
            Math.floor(Math.random() * mapSize.y));
    } while (endPosition.x != startPosition.x && endPosition.y != startPosition.y);

    $('canvas')[0].addEventListener('click', function(event){
        let x = Math.floor(event.offsetX / nodeSize);
        let y = Math.floor(event.offsetY / nodeSize);
        
        endPosition = new Vector(x, y);
        runAlg();
    }, false);

    const canvas = new Canvas(nodeSize * mapSize.x, nodeSize * mapSize.y);
    const c = canvas.context;

    for (let y = 0; y < mapSize.y; y++) {
        for (let x = 0; x < mapSize.x; x++) {
            nodeList.push(new Node(c, new Vector(x, y), nodeSize));
        }
    }

    for (let i = 0; i < nodeList.length; i++) {
        let neighbours = [];
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                let neighbourPosition = new Vector(
                    nodeList[i].position.x + x,
                    nodeList[i].position.y + y
                );
                if(x == 0 && y == 0) continue;
                if(x != 0 && y != 0) continue;
                let neighbour = getNodeAt(neighbourPosition);
                if(neighbour) neighbours.push(getNodeIndex(neighbourPosition));
            }
        }
        nodeList[i].setNeighbours(neighbours);
    }

    function runAlg(){

        for (let i = 0; i < nodeList.length; i++) {
            nodeList[i].resetNode();
        }

        nodeList[getNodeIndex(startPosition)].setState('start');
        nodeList[getNodeIndex(endPosition)].setState('end');
        const a = new aStar(nodeList, startPosition, endPosition, mapSize);
        let path = a.run();
    
        if(path != null){
            for (let i = 0; i < path.length; i++) {
                let index = getNodeIndex(path[i].position);
                nodeList[index].setState('path');
            }
        }
    
        canvas.update();
        
        for (let i = 0; i < nodeList.length; i++) {
            nodeList[i].draw();
        }
    }

    runAlg();

    // MAIN FUNCTION
    // (function animate(){
    //     requestAnimationFrame(animate);
    // })();

    function getNodeIndex(position){
        return position.y * mapSize.x + position.x
    }

    function getNodeAt(position){
        if(position.x < 0 || position.x >= mapSize.x){
            return;
        }
        if(position.y < 0 || position.y >= mapSize.y){
            return;
        }
        return nodeList[getNodeIndex(position)];
    }
});