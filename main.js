$(document).ready(()=>{
    window.logger = new Logger();
    const algorithm = $('#algorithm');
    let selectedAlgorithm = algorithm[0].value;
    $('#algorithm').on('input', function () {
        selectedAlgorithm = algorithm[0].value;
        map.resetMap();
        canvas.update();
        map.renderMap();
        run();
    });

    const executionType = $('#executionType');
    let selectedExecutionType = executionType[0].value;
    $('#executionType').on('input', function () {
        selectedExecutionType = executionType[0].value;
        map.resetMap();
        canvas.update();
        map.renderMap();
        run();
    });

    const mapType = $('#mapType');
    let selectedMapType = mapType[0].value;
    $('#mapType').on('input', function () {
        selectedMapType = mapType[0].value;
        map.buildMap(selectedMapType);
        run();
    });

    const iterationsSlider = $('#iterationsRange');
    let iterations = Number(iterationsSlider[0].value);
    $('#iterationsRange').on('input', function () {
        iterations = Number(iterationsSlider[0].value);
    });

    $('#generateMap').on('click', function () {
        map.buildMap(selectedMapType);
        run();
    });
    $('#runAlg').on('click', function () {
        map.resetMap();
        canvas.update();
        map.renderMap();
        run();
    });

    let paused = false;
    $('#pauseAlg').on('click', function () {
        if(!paused){
            paused = true;
            $('#pauseAlg')[0].innerText = 'Resume';
        }else{
            paused = false;
            $('#pauseAlg')[0].innerText = 'Pause';
        }
    });

    const nodeSize = 10;
    let windowSize = new Vector(window.innerWidth - 320, window.innerHeight);

    windowSize.x = windowSize.x - (windowSize.x % nodeSize);
    windowSize.y = windowSize.y - (windowSize.y % nodeSize);

    if(windowSize.x % 2 == 0){
        windowSize.x -= nodeSize;
    }
    if(windowSize.y % 2 == 0){
        windowSize.y -= nodeSize;
    }

    const mapSize = new Vector(windowSize.x / nodeSize, windowSize.y / nodeSize);
    const canvas = new Canvas(nodeSize * mapSize.x, nodeSize * mapSize.y);
    const c = canvas.context;
    const map = new NodeMap(c, mapSize, nodeSize, selectedMapType);

    function run(){
        let alg;
        if(selectedAlgorithm == 'A'){
            alg = new AStar(map);
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
        canvas.update();
        map.renderMap();
    }

    function manualRun(alg){
        alg.initializeAlgorithm();
        const stepper = new Stepper(alg);
        let path;
        $('#stepAlg').on('click', function(){
            path = stepper.step();
            if(path){
                map.setPath(path);
                canvas.update();
                map.renderMap();
                return;
            }
            canvas.update();
            map.renderMap();
        });
    }

    function animatedRun(alg){
        alg.initializeAlgorithm();
        const stepper = new Stepper(alg);
        let path;
        let interval = setInterval(() => {
            if(!paused){
                for (let i = 0; i < iterations; i++) {
                    path = stepper.step();
                    if(path){
                        map.setPath(path);
                        clearInterval(interval);
                        canvas.update();
                        map.renderMap();
                        return;
                    }
                }
                canvas.update();
                map.renderMap();
            }
        }, 0);

        $('#stepAlg').on('click', function(){
            if(paused){
                path = stepper.step();
                if(path){
                    map.setPath(path);
                    canvas.update();
                    map.renderMap();
                    return;
                }
                canvas.update();
                map.renderMap();
            }
        });
    }

    run();
});