$(document).ready(()=>{
    
    const mapSize = new Vector(300, 120);
    const nodeSize = 5;
    const canvas = new Canvas(nodeSize * mapSize.x, nodeSize * mapSize.y);
    const c = canvas.context;
    const map = new NodeMap(c, mapSize, nodeSize);

    function runAlg(){

        map.resetMap();

        const a = new aStar(map);
        let path = a.run();
    
        if(path != null){
            map.setPath(path);
        }
    
        canvas.update();
        map.renderMap();
    }

    runAlg();
});