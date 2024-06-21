/**
 * Series of methods useful for manipulating and dealing with arrays.
 */
const ArrayMethods = {
    /**
     * Pushes element into array provided it is not already present. (Prevents duplication);
     * @param {any} element 
     * @param {array} array 
     */
    conditionalPush: function (element,array) {
        array.indexOf(element) == -1? array.push(element) : array;
        return array;
    },
    /**
 * Returns an indexed rotation of an input array. Optionally concatenate.
 * @param {array} array 
 * @param {int} index 
 * @param {boolean} concat 
 * @returns array || string
 */
    singleRotate: function (array,index,concat = false) {
        let res = [...array.slice(index),...array.slice(0,index)];
        return concat? res.join('|') : res;
    },

/**
 * Returns all rotations of a given array. Optionally concatenate subarrays.
 * @param {array} array 
 * @param {boolean} concat 
 * @returns 2d array || 1d array ['str'];
 */
    rotations: function (array,concat = false) {
    let res = [];
    for (let a = 0; a < array.length; a++) {
        res.push(ArrayMethods.singleRotate(array,a,concat));
    }
    return res;
},

/**
 * Checks the two arrays to determine if one is an ordered rotation of the other. Can return the rotation index or a boolean.
 * @param {array} array1 
 * @param {array} array2 
 * @param {boolean} showIndex 
 * @returns int || boolean
 */
    isRotation: function (array1,array2,showIndex = false) {
        let opts = ArrayMethods.rotations(array2,true);
        let result = opts.indexOf(ArrayMethods.singleRotate(array1,0,true));
        return showIndex? result : result !== -1;
    },
    /**
     * Iterative algorithm for finding all indexes of a given element.
     * @param {array} array 
     * @param {any} element 
     * @returns Indexes
     */
    array_find: function (array,element) {  //O(n)
        let res = [];
        for (let a = 0; a < array.length; a++) {
            if (array[a] == element) {
                res.push(a);
            }
        }
        return res;
    },
    /**
     * Returns the all indexes of elements in the input array.
     * @param {array} array 
     * @param  {...any} elements 
     * @returns Array
     */
    get_many: function (array,...elements) {
        let res = [];
        for (let a = 0; a < array.length; a++) {
            for (let b = 0; b < elements.length; b++) {
                if (array[a] == elements[b]) {
                    res.push(a);
                }
            }
        }
        return res;
    },
    /**
     * Concatenates an array, if array is 2d, concatenates each subarray.
     * @param {array} array 
     * @returns 1d array
     */
    array_concat: function (array) {
        if (typeof array[0] === 'object') {
            return array.map(x => x.join('|')); //Use the pipe to prevent confusion with decimal points.
        }
        else {
            return array.join('|');
        }
    },
    /**
     * Creates an array of size (elements) with pseudo-random numbers between min-max (inclusive).
     * @param {int} elements 
     * @param {int} min 
     * @param {int} max 
     * @returns array
     */
    random_array: function (elements,min,max) {
        let res = [];
        for (let a = 0; a < elements; a++) {
        res.push(Math.floor(Math.random()*(max-min+1))+min);
        }
        return res;
    },
    /**
     * Reverses an input array.
     * @param {array} array 
     * @returns reversed array
     */
    reverse: function (array) {
        return array.reverse();
    },
    /**
     * Search a 2d array for a subarray. Returns indexes.
     * @param {array} query 
     * @param {array} array 
     * @returns Indexes
     */
    search_subarrays: function (query,array) {
        let conc = ArrayMethods.array_concat(array);
        return ArrayMethods.array_find(conc,ArrayMethods.array_concat(query));
    },

    /**
     * Returns either the unique subarrays or the number of instances of each unique subarray. 
     * @param {array} array 
     * @param {boolean} ordered true: [a,b] != [b,a] false: [a,b] == [b,a]; 
     * @param {boolean} return_count Output shows unique elements and their count.
     * @returns Unique Subs || Counts.
     */
    unique_subarray: function (array,ordered = false,return_count = false) { //O(n * log(m))
        let step1 = ordered? array.map(sub => sub.join('|')) : array.map(sub => sub.sort((a,b) => a-b).join('|'));
        let elim = Array.from(new Set(step1));
        let inds = elim.map(x => step1.indexOf(x));
        if (return_count == false) {
            return inds.map(index => array[index]);
        }
        else {
            return inds.map(index => [array[index],this.get_many(step1,step1[index]).length]);
        }
    }
}

/**
 * Constructor of the MySet class. Contains methods for set theoretical computation.
 * @param {int} modulus 
 * @param  {...any} elements 
 */
function MySet(modulus,...elements) {
    this.modulo = (value,modulus) => { //(2 operations per call);
        if (value >= 0) {
            return value%modulus;
        }
        else {
            return (value%modulus)+modulus;
        }
    }
    this.universe = modulus,
    this.set = Array.from(new Set(elements.map(x => this.modulo(x,this.universe)))).sort((a,b) => a-b), //3 operations
    this.interval_class = (value,modulus = this.universe) => {
        let opts = [this.modulo(value,modulus),this.modulo(modulus-value,modulus)];
            return Math.min(...opts);
        },
    /**
    * Returns the Adjacency Interval Series, or the intervals between consecutive elements in a given modular universe.
    * @param {array} array 
    * @param {int} modulus 
    * @returns array. 
    */
    this.ais = (array = this.set,modulus = this.universe) => {  //O(n) (Linear)
        let res = [];
        for (let a = 1; a < array.length; a++) {
            res.push(this.modulo(array[a]-array[a-1],modulus));
            }
        return res;
        },
    /**
     * 
     * @param {int} index 
     * @returns this.set -> t(n) mod this.universe.
     */
    this.transpose = function (array = this.set, modulus = this.universe, index = 0) {
        return array.map(x => this.modulo(x+index,modulus)); //O(n);
    },
    /**
     * 
     * @param {int} index 
     * @returns this.set -> t(n)I mod this.universe. 
     */
    this.invert = function (array = this.set,modulus = this.universe,index = 0) {
        return array.map(x => this.modulo(index-x,modulus)); //O(n);
        },
    /**
    * Generates the powerset of an input using bitwise operands. Faster than array manipulation method. Useful for large sets. 
    * @param {array} array 
    * @returns powerset
    */
    this.literal_subsets = (cardinality = null,array = this.set) => {   // O(2^n) //4+(2^n) operations. 
        let result = [];
        if (cardinality === null) {
            for (let a = 1; a <= array.length; a++) {
                result.push(...Combinatorics.subsets(array,a));
            }
        }
        else {
            result = Combinatorics.subsets(array,cardinality);
        }
        return result;
    },
    /**
     * There's a recursion depth issue here.
     * @param {array} array 
     * @param {int} mod 
     * @returns Literal Subsets in Prime Form.
     */
    this.abstract_subsets = (cardinality = null,uniques = false,array = this.set, mod = this.universe) => {    //2 additional operations.
        let start = this.literal_subsets(cardinality,array).filter(x => x.length > 2);
        let res = start.map(y => this.prime_form(y,mod)).sort((a,b) => a.length < b.length);
        return uniques? ArrayMethods.unique_subarray(res) : res;
    },
    /**
     * Normal order function using the Straus-Rahn Algorithm. Iterative implementation.
     * @param {array} array this.set
     * @param {*} mod this.universe
     * @returns Normal Order
     */
    this.normal_order = (array = this.set,mod = this.universe) => { // Total = O(n^2)
        let index = array.length-1; 
        let rotations = [...ArrayMethods.rotations(array.sort((a,b) => a-b))]; //n ops
        while (index > 0) {     //n
            let curr = [];
            for (let a = 0; a < rotations.length; a++) {    //n
                curr.push(this.modulo(rotations[a][index]-rotations[a][0],mod)); //1
            }
            let small = ArrayMethods.array_find(curr,Math.min(...curr)); //2 opers  Break upon finding single winner. Or If symmetrical return index 0.
            if (small.length == 1 || index == 0) {
                return rotations[small[0]];
            }
            else {      //Remove rotations not in small;
                rotations = small.map(x => rotations[x]); //n
            }
            index--;//1
        }
        return rotations[0];    //if rotations.length > 1 all are acceptabe Normal Orders.
    }
    /**
    * Returns the Prime Form of a set (Straus-Rahn)
    * @param {array} array 
    * @param {int} mod 
    * @returns Prime Form
    */
    this.prime_form = (array = this.set,mod = this.universe) => { // O(n);
        let norm = this.normal_order(array,mod);
        let options = [norm,this.normal_order(this.invert(norm))];  //1
        let intervals = options.map(x => this.ais(x,mod)); //n
        let round = 0;
        while (round < intervals[0].length) { //n-1;
            if (intervals[0][round] < intervals[1][round]) {
                return options[0].map(x => this.modulo(x-options[0][0],mod));
            }
            else if (intervals[0][round] > intervals[1][round]) {
                return options[1].map(x => this.modulo(x-options[1][0],mod));
            }
            else if (round == array.length-2) {
                return options[0].map(x => this.modulo(x-options[0][0],mod));
            }
            else {
                round++;
            }
        }
    },
    /**
     * Generates the ICV of an input set. The sum of all intervals between constituent members. Essentially a summary of invariant tones under transposition. Holds true for all members of set class.
     * @param {array} array 
     * @param {int} mod 
     * @returns Interval Class Vector 
     */
    this.interval_class_vector = (array = this.set,mod = this.universe) => {    //n^2)/2
        let collect = [];
        for (let a = 0; a < array.length; a++) {
            for (let b = a+1; b < array.length; b++) {
                collect.push(this.modulo(array[b]-array[a],mod));//2
            }
        }
        let vector = [];
        for (let a = 1; a <= Math.floor(mod/2); a++) {
            if (a == Math.ceil(mod/2)) {
                vector.push(ArrayMethods.array_find(collect,a).length);
            }
            else {
                vector.push(ArrayMethods.array_find(collect,a).length+ArrayMethods.array_find(collect,mod-a).length)
            }
        }
        return vector;
    },
    /**
     * Returns the IV of an input set. This is a summary of the number of invariant tones under inversion. As such it is unique to each T or I in a set class.
     * @param {array} array 
     * @param {int} mod 
     * @returns Index Vector
     */
    this.index_vector = (array = this.set,mod = this.universe) => { // n^2+n+2
        let collect = [];
        for (let a = 0; a < array.length; a++) {
            for (let b = 0; b < array.length; b++) {
                collect.push(this.modulo(array[b]+array[a],mod));
            }
        }
        let vector = [];
        for (let a = 0; a < mod; a++) {
            vector.push(ArrayMethods.array_find(collect,a).length);
        }
        return vector;
    }
    /**
     * Returns all transpositions and inversions of a given set as an object literal.
     * @param {array} array 
     * @param {int} modulus 
     * @returns Set Class
     */
    this.set_class = (array = this.set,modulus = this.universe) => {
        let result = {};
        for (let a = 0; a < modulus; a++) {
            result['T'+a] = this.normal_order(array.map(x => this.modulo(x+a,modulus)),modulus);
            result['I'+a] = this.normal_order(array.map(y => this.modulo(a-y,modulus)),modulus);
        }
        return result;
    },
    /**
     * Determines if two input arrays have any meaningful PC relationship. It the sets are the same cardinality, test
     *  for T/I and Z relation. If the two sets are not the same cardinality, tests for literal and abstract (Prime Form) inclusionary relationship.
     * @param {array} array1 
     * @param {array} array2 
     * @param {int} modulus 
     * @returns Relationship
     */
    this.compare_set = (array1, array2 = this.set,modulus = this.universe) => {
        let no1 = this.normal_order(array1,modulus); 
        let no2 = this.normal_order(); 
        if (array1.length == array2.length) {   //Transposition or Inversional Equivalence.
            let sc = this.set_class(no2,modulus);
            let res = null;
            for (value in sc) { 
                if (ArrayMethods.array_concat(sc[value]) == ArrayMethods.array_concat(no1)) {
                    res = value;
                }
            }
            if (res === null) { //Z relation
                if (ArrayMethods.array_concat(this.interval_class_vector(array2,modulus)) == ArrayMethods.array_concat(this.interval_class_vector(array1,modulus)) == true) {
                    res = `[${array1}] and [${array2}] are Z related.`;
                }
                else {
                    res = 'No Relationship.';
                }
            }
            return res;
        }
        else {      //Not same cardinality. Maybe Move this up?
            let sizes = [no1,no2].sort((a,b) => a.length - b.length); //sizes[0] = short sizes[1] = long;
            let subs = {
                'Literal': this.literal_subsets(null,sizes[1]).map(x => this.normal_order(x,modulus)),
                'Abstract': this.abstract_subsets(sizes[1],modulus)
                };
            let checkLits = ArrayMethods.search_subarrays(sizes[0],subs['Literal']).length;
            let checkAbs = ArrayMethods.search_subarrays(this.prime_form(sizes[0]),subs['Abstract']).length;
            if (checkLits > 0) {
                return `[${sizes[0]}] is a literal subset of [${sizes[1]}].`;
            }
            else if (checkLits == 0 && checkAbs > 0) {
                return `[${sizes[0]}] is an abstract subset of [${sizes[1]}]. Contained ${checkAbs} times.`;
            }
            else {
                return 'No inclusionary relationship.'
            }
        }
    }
};

const palindrome = (array) => {
    let res = 0;
    for (let a = 0; a < array.length; a++) {
        if (array[a] == array[array.length-(a+1)]) {
            res++;
        }
    }
    return res==array.length;
}

const mod = (value,modulus) => {
    if (value >= 0) {
        return value% modulus;
    }
    else {
        return (value%modulus)+modulus;
    }
}

/**
 * Checks the sup array for all elements of sub.
 * @param {array} sub 
 * @param {array} sup 
 * @returns boolean
 */
const isLiteral = (sub,sup) => {
    let res = sub.map(x => sup.indexOf(x) !== -1);
    return res.every(x => x);
}


/**
 * Simplified way to determine at what T/I levels a superset contains a subset at. Optionally plot individual sets. 
 * @param {array} sub 
 * @param {array} sup 
 * @param {int} modulus 
 * @returns Array
 */
const isAbstract = (sub,sup,modulus) => {
    let res = [];
    let sc = new MySet(modulus,...sub).set_class();
    for (let key in sc) {
        isLiteral(sc[key],sup)? res.push(key) : null;
    }
    return [res,res.map(x => sc[x])];   //[0] = transformations [1] == actual sets.
}

//console.log(isAbstract([0,3,7,8],[0,1,2,3,4,5,6,7,8,9,10,11],12))

const Shape = {
    /**
     * Determines position of n points around a regular polygon of with sides of length l.
     * @param {array} center [x,y] 
     * @param {int} numPoints 
     * @param {int} length 
     */
    getPoints: function (center,numPoints = 3,length = 50) {
        let allAngles = 360/numPoints;      //(180*(numPoints-2))/numPoints is really interesting!
        let vertices = [];
        for (let a = 0; a < numPoints; a++) {
            let angle = ((a*allAngles) -90) * Math.PI/180;  //-90 sets top element to 0;
            let x = center[0] + length * Math.cos(angle);
            let y = center[1] + length * Math.sin(angle);
        vertices.push([x, y]);
        }
        return vertices;
    },
    /**
     * Replacement for previous calculator.
     * @param {int} points
     * @param {float} length l of polygon sides.
     * @param {string} label 
     * @param {boolean} textRotate true = text rotates with shape || false = text doesn't rotate.
     * @param {float} rotate Degrees to rotate (default = 0).
     * @param {boolean} showNodes
     */
    AdvancedPolygon: function (points = 3,length,label = '',textRotate = false,rotate = 0) {
        this.scaleLength = length//length*(Math.round(.05*points));
        this.drawArea = (this.scaleLength*2.3);
        this.draw = document.getElementById('drawing').value? "": SVG().addTo("#drawing").size(this.drawArea,this.drawArea);
        this.center = [this.drawArea/4,this.drawArea/4];  
        this.selectionShape = this.draw.polygon().fill('#dad2d2ff').stroke({color: 'black',width: 1}).translate(...this.center); 
        this.angle = rotate;
        this.queue = [];
        this.points = Shape.getPoints(this.center,points,this.scaleLength);
        this.cell = this.draw.group().translate(...this.center);
        this.shape = this.draw.polygon().stroke({ width: 1, color: 'black' }).fill('none');
        let text = this.draw.text(`${label}`).center(...this.center);
        textRotate == false? text.rotate(360-rotate) : text;
        this.nodeGrp = this.draw.group().translate(...this.center);
        this.collection = [];   //
        this.selectElements = [];   //
        this.allNodes = [];//Stores each node object of the polygon. 
        this.display = document.getElementById('display');
        for (let a = 0; a < this.points.length; a++) {
            let node = this.draw.group().translate(this.points[a][0],this.points[a][1]);
            let circ = this.draw.circle(25).fill('white').center(0,0).fill('white').stroke({width: 1, color: 'black'});
            let text = this.draw.text(`${a}`).center(0,0);
            const self = {
                'element': a,
                'coord': [this.points[a][0],this.points[a][1]],
                'circle': circ,
                'node': node,
                'selcted': false,
                /**
                 * Handles the clicking behavior of indidividual nodes.
                 */
                'handleClick': () => {
                    self.node.click(() => {
                        self.selected = !self.selected
                        console.log(`Element ${a} -> ${self.selected? 'Selected' : 'Deselected'}`);
                    })
                }
            }
            self.handleClick();
            this.allNodes.push(self);
            node.add(circ);
            node.add(text).rotate(360-rotate);  //Keep labels fixed in place.
            this.nodeGrp.add(node);
            }
            document.addEventListener('click',() => {   //Causes some issues.
                this.selectElements = this.allNodes.filter(x => x.selected == true);
                console.log(this.selectElements)
                this.allNodes.map(z => z.selected == true? z.circle.fill('#ff8989ff') : z.circle.fill('white'));
                this.collection = this.selectElements.map(k => k.element);
                this.selectionShape.plot(this.selectElements.map(y => y.coord));
            });
        this.updater = (array) => {
            console.log(`Input Array: ${array}`);
            let daSet = new MySet(points,...array);
            let daBigSet = new MySet(points,...this.collection);
            document.getElementById('sub').innerHTML = `Normal Form: ${daSet.normal_order()}<br>
            Prime Form: ${daSet.prime_form()}<br>
            Interval Class Vector: ${daSet.interval_class_vector()}<br>
            Index Vector: ${daSet.index_vector()}`;
            document.getElementById('super').innerHTML = `Normal Form: ${daBigSet.normal_order()}<br>
            Prime Form: ${daBigSet.prime_form()}<br>
            Interval Class Vector: ${daBigSet.interval_class_vector()}<br>
            Index Vector: ${daBigSet.index_vector()}`;
            let count = 0;
            this.queue.length !== 0? this.queue.forEach(elem => {
                elem.shape.remove();
                this.queue = this.queue.slice(1);
                }) : undefined;
            let abs = isAbstract(array,this.collection,points);
            //console.log(`ABS Output: ${JSON.stringify(abs[1])}`);
            //let invars = ArrayMethods.unique_subarray(abs[1],true);  //Stores the unique subarrays!
            abs[1].forEach(x => {
                let nextCoord = [];
                for (let a = 0; a < x.length; a++) {
                    nextCoord.push(this.allNodes[x[a]].coord);
                }
                const curSub = {
                    'shape': this.draw.polygon(nextCoord).fill('none').stroke({width: 1, color: 'grey'}).translate(...this.center).rotate(this.angle),
                    'show': false,
                    'text': function () {
                        let but = document.createElement('button');
                        let id = `${abs[0][count]}: [${abs[1][count]}]`;
                        but.innerHTML = id;
                        but.addEventListener('mousedown',() => {
                            this.show = !this.show;
                            if (this.show == true) {    //When Selected
                                this.shape.fill('#ffa0a0a3');
                                but.style.backgroundColor = 'darkslateblue'
                                but.style.color = 'white';
                            }
                            else {      //When deselected
                                this.shape.fill('none');
                                but.style.backgroundColor = 'lightsteelblue';
                                but.style.color = 'black';
                            }
                        })
                        id[0] == 'T'? document.getElementById('display').appendChild(but) : document.getElementById('display2').appendChild(but); //This should work!
                    }
                }
                curSub.text();
                this.queue.unshift(curSub);
                count++;
            })
        }
        this.shape.plot(this.points);
        this.cell.add(this.shape);
        this.cell.add(text)
        this.cell.rotate(rotate);
        this.nodeGrp.rotate(rotate);
        }
}

function PolyInput(parent = undefined) {
    let cont = document.createElement('div');
    let mod = document.createElement('input');
    mod.setAttribute('type','number');
    //let nextSet = document.createElement('button');
    //nextSet.innerHTML = 'Draw New Set';
    let clear = document.createElement('button');
    clear.innerHTML = 'Clear';
    let remov = document.createElement('button');
    remov.innerHTML = 'Complement:';
    let sub = document.createElement('input');
    sub.setAttribute('type','text');
    sub.setAttribute('placeholder','Subset:');
    cont.appendChild(mod);
    cont.appendChild(remov);
    cont.appendChild(clear);
    //cont.appendChild(nextSet);
    cont.appendChild(sub);
    parent == undefined? document.body.appendChild(cont) : document.getElementById(parent).appendChild(cont);
    this.universe = null;
    this.inputSub = [];
    let enter = () => {
        mod.addEventListener('keydown',(event) => {
            if (event.key == 'Enter') {
                document.querySelectorAll('div').innerHTML = '';
                this.universe = parseInt(mod.value);
                WA = new Shape.AdvancedPolygon(this.universe,150,'',false,0,true)
                }
            })
        sub.addEventListener('keydown',(event) => {
            if (event.key == 'Enter') {
                document.getElementById('display').innerHTML = '';
                document.getElementById('display2').innerHTML = '';
                //document.getElementById('data').innerHTML = '';
                let regex = /[0-9]+/ig;
                let temp = sub.value.match(regex);
                this.inputSub = temp.map(z => parseInt(z));
                WA.updater(this.inputSub);
            }
        }) 
    }
    document.addEventListener('click',(event) => {
        if (event.target == remov) {
            WA.allNodes.forEach(x => {
                x.selected = !x.selected;
            })
        }
        else if (event.target == clear) {
            document.querySelectorAll('div').innerHTML = '';
            WA = new Shape.AdvancedPolygon(this.universe,150,'',false,0,true);
        }
    })
    enter();
}

let WA;
let D;

document.addEventListener('DOMContentLoaded',() => {
    let D = new PolyInput('inputs');
    //let WA = new Shape.MyPolygon(D.universe,120,'Hi',false,0,true)
})

