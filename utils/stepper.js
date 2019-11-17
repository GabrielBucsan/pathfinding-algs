class Stepper{
    constructor(stepObject){
        this.stepObject = stepObject;
        this.iterator = this.iteratorFunction();
    }

    * iteratorFunction(){
        while (true) {
            yield this.stepObject.step();
        }
    }

    step(){
        return this.iterator.next().value;
    }
}