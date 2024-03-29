$(document).ready(()=>{
    window.logger = new Logger();

    const algorithm             = $('#algorithm');
    const heuristic             = $('#heuristic');
    const executionType         = $('#executionType');
    const mapType               = $('#mapType');
    const iterationsSlider      = $('#iterationsRange');

    let selectedAlgorithm       = algorithm[0].value;
    let selectedHeuristic       = heuristic[0].value;
    let selectedExecutionType   = executionType[0].value;
    let selectedMapType         = mapType[0].value;
    let iterations              = Number(iterationsSlider[0].value);

    $('#algorithm').on('input', function () {
        resetExecution();
        selectedAlgorithm = algorithm[0].value;
        run();
    });
    $('#heuristic').on('input', function () {
        resetExecution();
        selectedHeuristic = heuristic[0].value;
        run();
    });
    $('#executionType').on('input', function () {
        resetExecution();
        selectedExecutionType = executionType[0].value;
        run();
    });
    $('#mapType').on('input', function () {
        resetExecution();
        selectedMapType = mapType[0].value;
        map.buildMap(selectedMapType);
        runAlg();
    });
    $('#iterationsRange').on('input', function () {
        iterations = Number(iterationsSlider[0].value);
    });
    $('#generateMap').on('click', function () {
        resetExecution();
        map.buildMap(selectedMapType);
        runAlg();
    });
    $('#changePosMap').on('click', function () {
        resetExecution();
        map.randomizeStartEnd();
        run();
    });
    $('#printMap').on('click', function () {
        let download = document.createElement('a');
        download.href = canvas.canvas.toDataURL('image/png');
        download.download = 'map.png';
        download.click();
    });
    $('#runAlg').on('click', function () {
        resetExecution();
       run();
    });

    function run(){
        map.resetMap();
        render();
        runAlg();
    }

    function render(){
        canvas.update();
        map.renderMap();
    }

    let paused = false;
    $('#pauseAlg').on('click', function () {
        togglePause();
    });

    function togglePause(pause){
        if(pause != undefined){
            paused = pause;
        }else{
            paused = !paused;
        }
        $('#pauseAlg')[0].innerText = (paused)? 'Resume' : 'Pause';
    }

    let interval;
    function resetExecution(){
        clearInterval(interval);
        togglePause(false);
    }

    const mapSizeElement = $('#mapSize');
    let nodeSize = Number(mapSizeElement[0].value);
    $('#mapSize').on('input', function () {
        nodeSize = Number(mapSizeElement[0].value);
        initializeScreen();
    });

    function initializeScreen(){
        let windowSize = new Vector(window.innerWidth - 320, window.innerHeight);
    
        windowSize.x = (windowSize.x - (windowSize.x % nodeSize)) / nodeSize;
        windowSize.y = (windowSize.y - (windowSize.y % nodeSize)) / nodeSize;
    
        if(windowSize.x % 2 == 0) windowSize.x --;
        if(windowSize.y % 2 == 0) windowSize.y --;

        mapSize = new Vector(windowSize.x, windowSize.y);
        canvas = new Canvas(nodeSize * mapSize.x, nodeSize * mapSize.y);
        c = canvas.context;
        map = new NodeMap(c, mapSize, nodeSize, selectedMapType);

        runAlg();
    }

    let mapSize;
    let canvas;
    let c;
    let map;

    initializeScreen();

    function runAlg(){
        let alg;
        if(selectedAlgorithm == 'A'){
            alg = new AStar(map, selectedHeuristic);
        }else if(selectedAlgorithm == 'D'){
            alg = new Dijkstra(map);
        }
        if(alg){
            if(selectedExecutionType == 'A'){
                automaticRun(alg);
            }else if(selectedExecutionType == 'T'){
                animatedRun(alg);
            }else if(selectedExecutionType == 'M'){
                manualRun(alg);
            }
        }
    }

    function automaticRun(alg){
        let path = alg.run();

        if(path != null){
            map.setPath(path);
        }
        render();
    }

    function manualRun(alg){
        alg.initializeAlgorithm();
        const stepper = new Stepper(alg);
        let path;
        $('#stepAlg').on('click', function(){
            for (let i = 0; i < iterations; i++) {
                path = stepper.step();
                if(path){
                    map.setPath(path);
                    render();
                    return;
                }
            }
            render();
        });
    }

    function animatedRun(alg){
        alg.initializeAlgorithm();
        const stepper = new Stepper(alg);
        let path;
        interval = setInterval(() => {
            if(!paused){
                for (let i = 0; i < iterations; i++) {
                    path = stepper.step();
                    if(path){
                        map.setPath(path);
                        clearInterval(interval);
                        render();
                        return;
                    }
                }
                render();
            }
        }, 0);
    }
});