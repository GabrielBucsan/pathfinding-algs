$(document).ready(()=>{

    const nodeSize = 5;
    let windowSize = new Vector(window.innerWidth - 300, window.innerHeight);
    
    windowSize.x = windowSize.x - (windowSize.x % nodeSize);
    windowSize.y = windowSize.y - (windowSize.y % nodeSize);

    if(windowSize.x % 2 == 0){
        windowSize.x -= nodeSize;
    }
    if(windowSize.y % 2 == 0){
        windowSize.y -= nodeSize;
    }

    const mapSize = new Vector(windowSize.x / nodeSize, windowSize.y / nodeSize);
    // const mapSize = new Vector(111);
    const canvas = new Canvas(nodeSize * mapSize.x, nodeSize * mapSize.y);
    const c = canvas.context;
    const map = new NodeMap(c, mapSize, nodeSize);

    const algorithm = $('#algorithm');
    let selectedAlgorithm = algorithm[0].value;

    $('#algorithm').on('input', function () {
        selectedAlgorithm = algorithm[0].value;
        run();
    });

    function run(){

        map.resetMap();

        let alg;
        if(selectedAlgorithm == 'A'){
            alg = new AStar(map);
        }else if(selectedAlgorithm == 'D'){
            alg = new Dijkstra(map);
        }
        if(alg){
            let path = alg.run();
        
            if(path != null){
                map.setPath(path);
            }
        }
        canvas.update();
        map.renderMap();
    }

    run();
});