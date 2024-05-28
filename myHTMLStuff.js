/**
 * Sorts toSort array according to the correct sorting of indexArray.
 * @param {array} indexArray Index array 
 * @param {*} toSort Array to be sorted according to index
 * @returns toSort in ascending order according to indexArray.
 */
const conditionalSort = (indexArray,toSort) => {
    let indexes = new Array(...indexArray);
    let correspondence = indexes.sort((a,b) => a-b).map(z => indexArray.indexOf(z));
    let res = correspondence.map(x => toSort[x]);
    return res;
}

const unpack = (array) => {
    let res = [];
    for (let a = 0; a < array.length; a++) {
        res.push(...array[a]);
    }
    return res;
}
 
 const ArrayMethods = {
    /**
     * Pushes element into array provided it is not already present. (Prevents duplication);
     * @param {any} element 
     * @param {array} array 
     */
    conditionalPush: function (element,array) {
        if (array.length == 0) {
            array.push(element);
        }
        else {
            let st = ArrayMethods.search_subarrays(element,array);
            if (st.lengh == 0) {
                array.push(element);
            }
        }
        return array;
    },
    /**
    * Gets rotations of an input. If index is null, return all rotations, else return specific rotation.(0 = input.).
    * @param {array} array 
    * @param {int} index 
    * @returns array
    */
    rotate: function (array,index = null) { // n+(n*2);
        let res = [];
        for (let a = 0; a < array.length; a++) {
            res.push([...array.slice(a),...array.slice(0,a)]);
            }
        if (index == null) {
            return res;
        }
        else {
            return res[index];
        }
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
            return array.map(x => x.reduce((a,b) => a+'.'+b));
        }
        else {
            return array.reduce((a,b) => a+'.'+b);
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
     * @param {boolean} ordered 
     * @param {boolean} return_count Output shows unique elements and their count.
     * @returns Unique Subs || Counts.
     */
    unique_subarray: function (array,ordered = false,return_count = false) { //O(n * log(m))
        let start = null;
        let concs = [];
        if (ordered == true) {
            start = array.map(x => x.sort((a,b) => a-b)); //2
        }
        else {start = array};
        for (let a = 0; a < start.length; a++) { //n
            concs.push(start[a].reduce((x,y) => x+'.'+y)); //n*2
        }
        let elim = Array.from(new Set(concs)); //1
        if (return_count == true) {
            let windex = elim.map(z => ArrayMethods.array_find(concs,z)); //n
            return windex.map(k => [array[k[0]],k.length]); //n+1
        }
        else {
            let windex = elim.map(z => ArrayMethods.array_find(concs,z)[0]);
            return windex.map(k => array[k]); //n
        }
    }
};

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
        let i = parseInt(index,10);
        return array.map(x => this.modulo(x+i,modulus)); //O(n);
    },
    /**
     * 
     * @param {int} index 
     * @returns this.set -> t(n)I mod this.universe. 
     */
    this.invert = function (array = this.set,modulus = this.universe,index = 0) {
        let i = parseInt(index,10);
        return array.map(x => this.modulo(i-x,modulus)); //O(n);
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
    this.abstract_subsets = (array = this.set, mod = this.universe) => {    //2 additional operations.
        let start = this.literal_subsets(null,array).filter(x => x.length > 2);
        return start.map(y => this.prime_form(y,mod)).sort((a,b) => a.length < b.length);
    },
    /**
     * Normal order function using the Straus-Rahn Algorithm. Iterative implementation.
     * @param {array} array this.set
     * @param {*} mod this.universe
     * @returns Normal Order
     */
    this.normal_order = (array = this.set,mod = this.universe) => { // Total = O(n^2)
        let index = array.length-1; 
        let rotations = [...ArrayMethods.rotate(array.sort((a,b) => a-b))]; //n ops
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
     * 
     * @param {array} array 
     * @param {int} modulus 
     * @returns Axes of Symmetry
     */
    this.symmetry = (array = this.set,modulus = this.universe) => {
        let res = [];
        let test = array.sort((r,s) => r-s).reduce((f,k) => f+'|'+k);
        for (let a = 0; a < modulus; a++) {
            let opt = this.invert(array,modulus,a).sort((i,j) => i-j).reduce((l,m) => l+'|'+m);
            opt == test? res.push([a/2,(a/2)+(modulus/2)]): null;
        }
        return res;
    },    

    /**
     * Determines if two input arrays have any meaningful PC relationship. It the sets are the same cardinality, test
     *  for T/I and Z relation. If the two sets are not the same cardinality, tests for literal and abstract (Prime Form) inclusionary relationship.
     * @param {array} array1 
     * @param {array} array2 
     * @param {int} modulus 
     * @returns Relationship;
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
}

let F;  //Declare in global scope!

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Loaded!');

/**
 * 
 * @param {string} label 
 * @param {string} id 
 * @param {string} type 
 * @param  {...any} values 
 */
function Dropdown(label,id,type,parent = null,...values) {
    this.selection = null;
    let ddown = document.createElement('select');
    let lab = document.createElement('p');
    lab.innerHTML = `${label}`;
    let dis = document.createElement('p');
    ddown.setAttribute('id',`${id}`);
    for (let a = 0; a < values.length; a++) {
        let opt = document.createElement('option')
        opt.innerHTML = `${values[a]}`;
        ddown.appendChild(opt);
    }
    if (parent == null) {
        document.body.appendChild(lab);
        document.body.appendChild(ddown);
        document.body.appendChild(dis);
    }
    else {
        document.getElementById(parent).appendChild(lab);
        document.getElementById(parent).appendChild(ddown);
        document.getElementById(parent).appendChild(dis);
    }
    dis.innerHTML = `Modulo ${this.selection}:`
    document.getElementById(`${id}`).addEventListener('change', (event) => {
        if (type == 'number') {
            this.selection = parseInt(event.target.value);
            console.log(this.selection);
        }
        else if (type == 'text') {
            this.selection = event.target.value;
        }
        dis.innerHTML = `Modulo ${this.selection}:` //Need to modify.
        document.getElementById('drawing').innerHTML = '';
        F = new drawCircles(500,500,200,this.selection); //Create new F updates upon selection.
    });
}

function MakeButton(parent,label = 'CLICK',id) {
    let button = document.createElement('button');
    button.setAttribute('id',`${id}`);
    this.clicked = false;
    this.clickedCount = 0;
    button.innerHTML = `${label}`;
    document.getElementById(parent).appendChild(button);
    button.addEventListener('click',() => {
        this.clickedCount +=1;
        if (this.clicked == true) {
            this.clicked = false;
        }
        else {
            this.clicked = true;
        }
    });
}

/**
 * Constructor for an ArrayInput object. Creates an input box. Allows keypresses 'Enter' and 'Backspace'.
 * @param {string} label
 * @param {string} type = "number"/"text";
 * @param {string} id 
 */
function ArrayInput(label,type,id,parent = null,reference) {
    this.elements = [];
    this.as_set = function () {
        return Array.from(new Set(this.elements.sort((a,b) => a-b)));
    };
    let inp = document.createElement('input');
    let labl = document.createElement('p');
    let out = document.createElement('div');
    labl.innerHTML = `${label}`;
    inp.setAttribute('id',`${id}`);
    inp.setAttribute('placeholder',`${type.toUpperCase()}`);
    if (parent == null) {
        document.body.appendChild(labl);
        document.body.appendChild(inp);
        document.body.appendChild(out);
    }
    else {
        document.getElementById(parent).appendChild(labl);
        document.getElementById(parent).appendChild(inp);
        document.getElementById(parent).appendChild(out);
    }
    inp.addEventListener('keydown',(event) => {     
        let poss = inp.value;
        let regex = /^[0-9]+/
        if (event.key === 'Enter') {
            if (regex.test(poss) == true) {
                this.elements.push(parseInt(poss));
            }
            else {
                console.log('invalid');
            }
            inp.value = '';
        }
        else if (event.key === 'Backspace') {
            if (poss.length == 0) {
                this.elements.pop();
            }
        }    
    });
}

/**
 * My current solution for creating labels. Not the best but it sorta works?
 * @param {array} array 
 * @param {array} labels [[column],[row]]; 
 * @returns restructured array
 */
const restructure = (array,labels) => {
    let res = [[]];
    res[0][0] = '';
    if (labels[0].length !== 0) {
        res[0].push(...labels[0]);
    }
    else {
        res[0].push(array.map(x => x = ''));
    }
    for (let a = 0; a < array.length; a++) {
        res.push([labels[1][a],...array[a]]);
    }
    return res;
}

/**
 * Creates a table based on an input 2d array and optional labels. 
 * @param {array} array 
 * @param {array} labels [[column labels],[row labels]];
 */
function ConstructTable(array,labels = null,parent) {
    let modified = undefined;
    if (labels == null) {
        modified = array;
    }
    else {
        modified = restructure(array,labels);
    }
    let table = document.createElement('table');
    for (let a = 0; a < modified.length; a++) {
        let row = document.createElement('tr');
        for (let b = 0; b < modified[a].length; b++) {
            let data = document.createElement('td');
            data.innerHTML = `${modified[a][b]}`;
            row.appendChild(data);
        }
        table.appendChild(row);
    }
    document.getElementById(parent).appendChild(table);
}; 

function makeRadio (parent) {
    this.parent = document.getElementById(`${parent}`);
    this.status = false;
    let but = document.createElement('button');
    but.innerHTML = `Complement:`;
    but.addEventListener('mousedown', () => {
        this.status? this.status = false : this.status = true;
        console.log(`Status: ${this.status}`)
        console.log(`Axes of Symmetry -> ${F.setRep.symmetry()}`)
    })
    this.parent.appendChild(but)
}

function NewPCInput (parent) {  //CURRENTLY NOT EXPANDABLE
    this.drop = new Dropdown('Select Modular Universe:','drop','number',parent,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24);
    //this.set = new ArrayInput('Input Array Elements:','number','set',parent,this.drop);
    this.modification = new DoubleDown(parent,'drop','doub',F);//Move to new column?
    this.clear = new MakeButton(parent,'CLEAR','clr');
    this.radio = new makeRadio(parent);
     /**
     * Creates a new div inside of the parent. 
     * @param {string} id 
     */
     this.addDisplay = function (id) {
        let dis = document.createElement('div');
        dis.setAttribute('id',`${id}`);
        document.getElementById(parent).appendChild(dis);
        this[`${id}`] = dis;
    }
}

let set1 = new NewPCInput('column1');
set1.addDisplay('dis1');
set1.addDisplay('dis2');

let message1 = `Normal Order serves as a sort of 'root position' for Pitch/Beat Class Sets. This program uses the 
Straus-Rahn Algorithm.`;
let message2 = `Prime Form is the representative form of all inversionally (reflection) and transpositionally (translation) related sets. This makes the prime form the representative of a 'set-class'.
For example all major and minor triads (which are inversionally related) are represented by the prime form (0,3,7).`
let message3 = `The Interval Class Vector is an inventory of all intervals (shortest distance either direction in the modulus) contained between the constituent members of a set.
The first entry is the total number of intervals of size 1 and modulus-1, the second is intervals of size 2 and modulus-2, etc. This vector shows the number of tones held invariant at a transposition level contained therein. This vector is true for all members
of the set class.`
let message4 = `The Index Vector is shows the number of invariant tones at a given inversion. Note that this vector is ONLY true for the given NORMAL FORM, NOT the entire set class.`

/**
 * 
 * @param {int} dx 
 * @param {int} dy 
 * @param {float} radius 
 * @param {int} points 
 */
function drawCircles (dx,dy,radius,points) {
    this.center = [dx/2,dy/2];
    this.diameter = radius*2;
    this.draw = document.getElementById('drawing').value? "": SVG().addTo("#drawing").size(dx,dy);
    this.draw.clear();
    this.setRep = null;
    this.allElems = [];
    this.modification = []; //Store transformation. Needs external operation
    this.polyline = this.draw.polyline().fill('#3f3f3f52').stroke({ color: 'black', width: 2 });
    this.modShape = this.draw.polyline().fill('#8de9ff52').stroke( {color: 'Grey', width: 2} );
    /**
     * Clears the drawing and creates a new instance of F. 
     */
    this.clear = () => {
        document.getElementById('drawing').innerHTML = '';
        F = new drawCircles(dx,dy,radius,points);
    }
    /**
     * Updates the elements included in the set and draws. Called each click.
     */
    this.update = () => {
        let res = [[],[]];  //Store points and coordinates for each element.
        let mod = [[],[]];  //Store points and coordinates for each modified.
        for (let x = 0; x < this.allElems.length; x++) {
            if (this.allElems.length == 0) {
                console.log('N/A: parent.allElems not initialized.');
            }
            else {  
                if (this.allElems[x].selected == true && this.modification.indexOf(x) === -1) { 
                    this.allElems[x].circle.fill('red');
                    res[0].push(x);
                    res[1].push(this.allElems[x].coords);
                }
                else if (this.modification.indexOf(x) !== -1 && this.allElems[x].selected === false) {
                    this.allElems[x].circle.fill('#79ff4cff')
                    mod[0].push(x);
                    mod[1].push(this.allElems[x].coords)
                }
                else if (this.modification.indexOf(x) !== -1 && this.allElems[x].selected === true) {
                    this.allElems[x].circle.fill('#ffee3aff')
                    res[0].push(x);
                    res[1].push(this.allElems[x].coords);
                    mod[0].push(x);
                    mod[1].push(this.allElems[x].coords);
                }
                else {
                    this.allElems[x].circle.fill('white'); //If unselected
                }
            }
        }
        //console.log(`Original: [${res[0]}] -> Modified: [${mod[0]}]`);
        res[1].push(res[1][0])  
        mod[1].push(mod[1][0])  //Double the first coordinate to complete the shape.
        this.polyline.plot(res[1]);
        this.modShape.plot(mod[1]); //Plot both shapes.
        this.setRep = new MySet(set1.drop.selection,...res[0]);  //Create Set Object.
        document.getElementById('dis2').innerHTML = `<br>
        Normal Order: [${this.setRep.normal_order()}]<br>
        Prime Form: (${this.setRep.prime_form()})<br>
        Interval Class Vector: <${this.setRep.interval_class_vector()}><br>
        Index Vector: <${this.setRep.index_vector()}><br>
        <br>`
    }
    for (let a = 0; a < points; a++) {
        let theta = (-Math.PI/2)+(2*Math.PI*a)/points;   //-Math.PI/2 = start angle 12 o'clock.
        let x = this.center[0]+radius*Math.cos(theta);
        let y = this.center[1]+radius*Math.sin(theta); 
        const circle = this.draw.circle(30,30).stroke( { width: 1, color: 'black' }).fill('white').center(x,y).id(`circle${a}`);
        const label = this.draw.text(`${a}`).center(x,y);
        let elem = {
            circle,
            label,
            selected: this.allElems && this.allElems.length >= points ? this.allElems[a].selected : false,
            coords: [x,y],
            /**
             * Toggles the elem.selected attribute. Required to draw shapes.
             */
            clicker: () => {
                circle.click(() => {
                    elem.selected = !elem.selected; //Toggle
                    console.log(`${a} -> ${elem.selected}`);
                    this.update();
                });
            }
        }
        elem.clicker();
        this.allElems[a] = elem;
    }
    document.getElementById('clr').addEventListener('mousedown',() => {
        this.clear();
        document.getElementById('dis2').innerHTML = '';
        console.log('Drawing Cleared');
    })
};

/**
 * Interacts with myCircle to onionskin transposed or inverted sets.
 * @param {*} parent 
 * @param {*} targ 
 */
function DoubleDown (parent,targ,id) {
    this.Tval = null;
    this.Ival = null;
    this.modified = [];
    let tdrop = document.createElement('select');
    tdrop.setAttribute('id',`${id}t`);
    let idrop = document.createElement('select');
    idrop.setAttribute('id',`${id}i`);
    let tlab = document.createElement('p');
    tlab.innerHTML = 'Tn (Transpose):';
    let ilab = document.createElement('p');
    ilab.innerHTML = 'TnI (Invert):';
    document.getElementById(targ).addEventListener('change',() => {
        tdrop.innerHTML = '';
        idrop.innerHTML =  '';
        let sel = document.getElementById(targ).value;
        console.log(`Modulus to ${sel}:`)
    for (let a = 0; a < sel; a++) {
        let topt = document.createElement('option');
        let iopt = document.createElement('option');
        topt.innerHTML = `${a}`;
        iopt.innerHTML =  `${a}`;
        tdrop.appendChild(topt);
        idrop.appendChild(iopt);
        }
    document.getElementById(parent).appendChild(tlab);
    document.getElementById(parent).appendChild(tdrop);
    document.getElementById(parent).appendChild(ilab);
    document.getElementById(parent).appendChild(idrop);
        });
    document.addEventListener('change', (event) => {
        this.Ival = null;
        this.Tval = null;
        let tv = document.getElementById('doubt');
        let iv = document.getElementById('doubi');
        if (event.target == tv) {   //tvalue is incorrect. Not sure what's going on here.
            this.Tval = tv.value;
            //console.log(`${F.setRep.set} -> ${F.setRep.transpose()}`)
            this.modified = F.setRep.transpose(undefined,undefined,this.Tval);
        }
        else if (event.target == iv) {
            this.Ival = iv.value;
            console.log(`Inversion set to ${this.Ival}`);
            this.modified = F.setRep.invert(undefined,undefined,this.Ival); //Need to reset modified each time.
        }
        F.modification = this.modified;
        F.update(); //update drawing on click.
        });
    }
    /**
     * Method for drawing lines of symmetry when toggled 'on'.
     * @param {str} parent 
     */
    function symmetryShow (parent) {
        let but = document.createElement('button');
        this.on = false;
        but.innerHTML = this.on;
        but.addEventListener('mousedown',() => {
            this.on = !this.on;
            but.innerHTML = this.on;
            if (this.on == true) {
                let allPoss = [];
                for (let a = 0; a < (set1.drop.selection)*2; a++) { //Recalculate circle positions with half positions possible.
                    let theta = (-Math.PI/2)+(2*Math.PI*a)/(set1.drop.selection*2);   //-Math.PI/2 = start angle 12 o'clock.
                    let x = F.center[0]+((F.diameter*1.2)/2)*Math.cos(theta);
                    let y = F.center[1]+((F.diameter*1.2)/2)*Math.sin(theta); 
                    allPoss.push([x,y]);
                    //F.draw.circle(5).fill('blue').center(x,y);
                }
                let symPoint = F.setRep.symmetry().map(z => [allPoss[z[0]*2],allPoss[z[1]*2]]); //Coordinates for points on axis of symmetry, I think this is an issue.
                console.log(symPoint)
                for (let b = 0; b < symPoint.length; b++) {
                    let line = F.draw.line().stroke( {width: 1, color: 'black', dasharray: '5,3'} );
                    line.plot(...unpack(symPoint[b]));
                    //F.draw.circle(20).stroke( {width: 2, color: 'purple'} ).center(...symPoint[b][0]);
                    console.log(symPoint[b]);
                }
                //console.log(symPoint);
            }
        })
        document.getElementById(`${parent}`).appendChild(but);
    }
    symmetryShow('column1');
});

//document.querySelector() to grab elements!