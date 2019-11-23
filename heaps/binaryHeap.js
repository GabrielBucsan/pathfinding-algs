class BinaryHeap{
    constructor(){
        this.heap = [];

        this.order = 'min';
    }

    insert(item){
        this.reorganizeHeapToParent(this.heap.push(item) - 1);
    }

    extract(){
        let item = this.heap[0];

        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.splice(this.heap.length - 1, 1);
        this.reorganizeHeapToChildren(0);

        return item;
    }

    changeItem(key, value){
        for (let i = 0; i < this.heap.length; i++) {
            if(this.heap[i].key == key){
                let temp = JSON.parse(JSON.stringify(this.heap[i]));
                this.heap[i].value = value;
                if(this.compareItems(temp, this.heap[i])){
                    this.reorganizeHeapToChildren(i);
                }else{
                    this.reorganizeHeapToParent(i);
                }
                return;
            }
        }
        console.error(`Key ${key} was no found in the heap!`);
    }

    reorganizeHeapToParent(index){
        let i = index;
        let parentIndex =  Math.floor((i - 1) / 2);
        if(this.heap.length > 1 && parentIndex >= 0){
            while (true) {
                if(this.heap[parentIndex] !== undefined && this.compareItems(this.heap[i], this.heap[parentIndex])){
                    let temp = this.heap[parentIndex];
                    this.heap[parentIndex] = this.heap[i];
                    this.heap[i] = temp;
                    i = parentIndex;
                    parentIndex =  Math.floor((i - 1) / 2);
                    continue;
                }
                break;
            }
        }
    }

    reorganizeHeapToChildren(index){
        let i = index;
        let childIndex1 = 2 * i + 1;
        let childIndex2 = 2 * i + 2;

        if(this.heap.length > 1){
            while (true) {
                if(this.heap[childIndex1] !== undefined && this.compareItems(this.heap[childIndex1], this.heap[i])){
                    let temp = this.heap[childIndex1];
                    this.heap[childIndex1] = this.heap[i];
                    this.heap[i] = temp;
                    i = childIndex1;
                    childIndex1 = 2 * i + 1;
                    childIndex2 = 2 * i + 2;
                    continue;
                }else if(this.heap[childIndex2] !== undefined && this.compareItems(this.heap[childIndex2], this.heap[i])){
                    let temp = this.heap[childIndex2];
                    this.heap[childIndex2] = this.heap[i];
                    this.heap[i] = temp;
                    i = childIndex2;
                    childIndex1 = 2 * i + 1;
                    childIndex2 = 2 * i + 2;
                    continue;
                }
                break;
            }
        }
    }

    compareItems(item1, item2){
        if(this.order == 'min'){
            return item1.value < item2.value;
        }else if(this.order == 'max'){
            return item1.value > item2.value;
        }
        console.error('[BinaryHeap] Unknown order');
    }
}