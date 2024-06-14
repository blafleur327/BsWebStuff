/**
 * Class filled with methods for combinatorics calculation.
 */
const Combinatorics = {
    /**
     * Recursively calculate n!
     * @param {int} n 
     * @param {int} res 
     * @returns n!
     */
    factorial: function (n,res = 1) {
        if (n == 1) {
            return res;
        }
        else {
            return this.factorial(n-1,res*n);
        }
    },
    /**
     * 
     * @param {int} universe m
     * @param {int} cardinality n
     */
    binomial_coefficient: function (universe,cardinality) {     //n = cardinality | m = universe
        return this.factorial(universe)/(this.factorial(cardinality)*this.factorial(universe-cardinality));
    },

    /**
     * Gets the Elements of size n within a given universe.
     * @param {int} universe 
     * @param {int} card 
     * @returns Powerset in Binary Representation.
     */
    binary_representation: function (universe,card) {
        let res = [];
        let count = 0;
        let max = parseInt(''.padStart(card,'1').padEnd(universe,'0'),2);   //Get value that starts with k 1s.
        for (let a = 2**card-1; a <= max; a++) {   
            let option = a.toString(2).padStart(universe,'0');
            let check = Array.from(option.match(/1/g)).length; //Does this modify the og string?
            if (check === card) {
                res.push(option);
            }
            count++;
        }
        return res;
    },

    /**
     * Returns elements from array that are 1 (True) in binary representation.
     * @param {array} array 
     * @param {string} bin 
     * @returns Array
     */
    picker: function (array, bin) {
        return array.filter((item, index) => bin[index] === '1');
    },

    /**
     * Returns all subsets of a given cardinality.
     * @param {array} superset 
     * @param {int} cardinality 
     * @returns Array
     */
    subsets: function (superset,cardinality) {
        let first = this.binary_representation(superset.length,cardinality);
        return first.map(z => this.picker(superset,z));
    }
}

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
 * Simplified way to determine at what T/I levels a superset contains a subset at.  
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
    return res;
}

/**
 * Equivalent to the Python print operation, since I am lazy.
 * @param {function} operation 
 */
const print = (operation) => {
    console.log(operation);
}


const findem = (string,check) => {
    let find = `[${check}]`;
    let regex = new RegExp(find,'ig');
    return string.match(regex).length;
}

const words = (string) => {
    return findem(string.trim(),' ')+1;
}

const sentences = (string) => {
    return findem(string,'.?!');
}

const factors = (n) => {
    let res = [];
    let test = 1;
    while (test <= n/test) {
        if (n%test == 0) {
            res.push(test,n/test);
        }
        test++;
    }
    return Array.from(new Set(res.sort((a,b) => a-b)));
}


/**
 * Methods used for Scale Theoretical calculations. Dependent upon the updated ArrayMethods class.
 */
const ScaleTheory = {
    /**
     * Returns a value mod n.
     * @param {int} value 
     * @param {int} modulus 
     * @returns value mod modulus; 
     */
    modulo: function (value,modulus) {
        return value >=0? value%modulus : (value%modulus)+modulus; 
    },
    /**
     * Gets adjacency interval series of an input set. 
     * @param {array} array 
     * @param {int} modulus 
     * @param {boolean} octave
     * @returns array -> AIS. 
     */
    ais: function (array,modulus,octave = false) {
        let res = [];
        octave? array.push(array[0]) : undefined;   //Double octave depending on bool.
        for (let a = 1; a < array.length; a++) {
            res.push(ScaleTheory.modulo(array[a]-array[a-1],modulus));
        }
        return res;
    },
    /**
     * Generates a well formed collection from various parameters.
     * @param {int} start Integer that collection starts on.
     * @param {int} interval Interval to be applied recursively.
     * @param {int} cardinality Limit to number of elements.
     * @param {int} universe Modulus.
     * @returns Array -> Well Formed Collection (Numerical, not scale order.)
     */
    generate: function (start = 0, interval,cardinality,universe = 12) {
        let result = [];
        for (let a = 0; a < cardinality; a++) {
            result.push((start+(interval*a)));
        }
        return result.map(element => element%universe).sort((a,b) => a-b);  //Sorted numerically.
    },
    /**
     * Determines if an input set is or is not well-formed. Can produce the generator.
     * @param {array} array 
     * @param {int} universe 
     * @param {boolean} returnGenerator
     * @returns Boolean || Generator
     */
    isWellFormed: function (array,universe,returnGenerator = false) {
        array = array.sort((a,b) => a-b);    //Put in ascending order
        let ints = ScaleTheory.ais(array,universe,true);
        let generator = 1; 
        let allWF = [];
        while (generator <= universe/2) {   //Only need to test half of the universe.
            let wf = [];
            for (let a = 0; a < array.length-1; a++) {
                wf.push(ScaleTheory.modulo(a*generator,universe));
            }
            wf.sort((a,b) => a-b);
            allWF.push(ScaleTheory.ais(wf,universe,true));
            generator++;
        } 
        let temp = allWF.map(elem => ArrayMethods.isRotation(elem,ints));   //Check if any subarrays are a rotation of the original ais.
        return returnGenerator? temp.indexOf(true)+1 : temp.indexOf(true) !== -1; 
    },
    /**
     * Determines if an input set is or is not degenerate. (That is that its generating interval is a factor of the universe)
     * @param {array} array 
     * @param {int} universe 
     * @returns boolean
     */
    degenerate: function (array,universe) {
        let step1 = ScaleTheory.isWellFormed(array,universe)? ScaleTheory.isWellFormed(array,universe,true) : false;
        if (typeof(step1) == 'number') {
            return factors(universe).indexOf(step1) !== -1;
        }
        else {
            return step1;
        } 
    },
    /**
     * Determines if an input array has the property of cardinality equals variety.
     * @param {array} array 
     * @param {int} universe 
     * @returns boolean
     */
    cv: function (array,universe) {
        return ScaleTheory.degenerate(array,universe)? false: array.length <= Math.floor(universe/2)+1;
    },

    /**
     * Generates the AIS or indexes of true values of a maximally even distribution of size n within a given universe.
     * @param {int} sub 
     * @param {int} universe 
     * @param {boolean} setOut 
     * @returns Array [Indexes of True values] || Array [AIS];
     */
    maxEvenInts: function (sub,universe,setOut = true) {
        let bin = [0];
        let temp = [];
        for (let a = 1; a < universe+1; a++) {
            temp.push(Math.floor((a*sub)/universe));
        }
        for (let b = 1; b < temp.length; b++) {
            temp[b] != temp[b-1]? bin.push(1) : bin.push(0);
        }
        return setOut? ArrayMethods.array_find(bin,1).map(x => x-1) :ScaleTheory.ais(ArrayMethods.array_find(bin,1),universe,true);
    },

    /**
     * Can either test if an array is maximally even or generate a maximally even set the size of the input array starting on 0.
     * @param {array} array 
     * @param {int} universe 
     * @param {boolean} generate 
     * @returns boolean || array
     */
    maximallyEven: function (array,universe,generate = false) {
        let bin = ScaleTheory.maxEvenInts(array.length,universe,generate);  //Variable output depending on next steps.
        if (generate == false) {    //Test input for ME property. -> Boolean
            return ArrayMethods.isRotation(ScaleTheory.ais(array,universe,true),bin);
        }
        else {  //Generate options -> Array.
            let result = ArrayMethods.rotations(bin);
            result.map(x => {
                let first = x[0];   
                for (let i = 0; i < x.length; i++) {
                    x[i] = ScaleTheory.modulo(x[i]-first,universe); //Transpose each rotation to zero.
                }
                x.sort((a,b) => a-b);
            })
            return ArrayMethods.unique_subarray(result);    //Eliminate duplicates if present.
        }
    },
    
    myhillsProperty: function (array,universe) { //Still not 100% sure how this is different from CV...
        return ScaleTheory.maximallyEven(array,universe)? ArrayFrom(new Set(ScaleTheory.ais(array,modulus,true))).length == 2: false;
    }
}

/**
 * Set of Methods useful for working with tone-rows and matrixes.
 */
const Serialism = {
    /**
     * Returns a value mod n.
     * @param {int} value 
     * @param {int} modulus 
     * @returns value mod modulus; 
     */
    modulo: function (value,modulus) {
        return value >= 0? value%modulus : (value%modulus)+modulus; 
    },
    toPitch: function (array,universe) {
        if (universe == 12) {
            pitches = ['C','C#/Db','D','D#/Eb','E','F','F#/Gb','G','G#/Ab','A','A#/Bb','B'];
            return array.map(x => pitches[x]);
        }
        else {
            return 'N/A';
        }
    },
    /**
     * Returns even partitions of an input array of size n. Omits arbitrary (Dependant on factors)
     * @param {array} array 
     * @returns 2d Array
     */
    partition: function (array) {
        let facts = factors(array.length);
        let result = [];
        for (let a = 0; a < facts.length; a++) {
            let temp = [];
            let len = array.length/facts[a];
            for (let b = 0; b < array.length; b+=len) {
                temp.push(array.slice(b,b+len));
            }
            result.push(temp);
        }
        return result.slice(1,result.length-1);
    },
    /**
     * Create a matrix of input array. 
     * @param {array} row 
     * @param {int} universe 
     * @param {boolean} pitches Make output pitch names?
     * @returns n*n matrix
     */
    matrix: function (row,universe = 12,pitches = false,labels = false) {
        let result = [row];
        for (let a = 1; a < row.length; a++) {
            let tLevel = Serialism.modulo(row[0]-row[a],universe);
            //result.push(tLevel);
            result.push(row.map(elem => Serialism.modulo(elem+tLevel,universe)));
        }
        result = pitches? result.map(x => Serialism.toPitch(x,universe)) : result;  //Is this the issue?
        if (labels == true) {
            result.forEach(x => {
                x.unshift(`P${x[0]}`);
                x.push(`R${x[0]}`)
            })
            result.unshift(row.map(z => `I${z}`));
            result.push(row.map(z => `RI${z}`));
            result[0][0] = ' ';
            result[0][result[0].length-1] = ' ';
            result[result.length-1][0] = ' ';
            result[result.length-1][result.length-1] = ' ';
        }
        return result;
    },
    /**
     * Returns a single row-form of a tone row.
     * @param {array} row
     * @param {string} form 
     * @param {int} universe = 12 
     * @returns Row Form.
     */
    singleRowForm: function (row,form,universe = 12,pitches = false) {
        let regex = [...form.match(/[a-z]+/ig),parseInt(form.match(/[0-9]+/g))];
        let offset = universe-row[0]; //Move index 0 to 0.
        let store; 
        if (regex[0] === 'P' || regex[0] === 'R') {
            let temp = row.map(elem => Serialism.modulo(elem+offset+regex[1],universe));
            store = regex[0] === 'P'? temp : temp.reverse();
        }
        else if (regex[0] === 'I' || regex[0] === 'RI') {
            let temp = row.map(elem => Serialism.modulo((regex[1]-elem)+row[0],universe));
            store = regex[0] === 'I'? temp : temp.reverse();
        }
        return pitches? Serialism.toPitch(store,universe) : store;
    },
    /**
     * Takes a tonerow in a given universe and determines non-trivial derivation levels.
     * @param {array} row 
     * @param {int} universe 
     * @param {boolean} showLevels 
     * @returns 2d array.
     */
    derivation: function (row,universe = 12,showLevels = false) {
        let result = [];
        let levels = [];
        let opts = Serialism.partition(row);
        opts.forEach(part => {
            let compile = [];
            for (let sub of part) {
                let setForm = new MySet(universe,...sub);
                compile.push(setForm.prime_form());
                //Find a way to test for the relationship between equal length partitionis.
            }
            result.push(compile);
        })
        let test = result.map(z => ArrayMethods.unique_subarray(z));
        let final = test.filter(k => k.length == 1);
        return [final.flat(),levels];
    }
}

/**
 * Could be useful for set theory calculations. Might be faster than other algos for NO and PF.
 * @param {array} array 
 * @param {int} universe 
 * @returns string
 */
const makeBinary = (array,universe,cut = false) => {
    let res = Array(universe).fill(0);
    for (let element of array) {
        res[element] = 1;
    }
    let rotate = ArrayMethods.rotations(res.join(''));
    let cuts = rotate.map(y => y.slice(y.indexOf('1'),y.lastIndexOf('1')+1))    //
    let lenIndex = cuts.map(z => z.length);
    let options = ArrayMethods.array_find(lenIndex,Math.min(...lenIndex));
    
    return options.map(a => rotate[a]).map(b => ArrayMethods.array_find(b,'1'));
}

let Q;

document.addEventListener('DOMContentLoaded',() => {

function Inputs(parent) {
    this.universe = null;
    this.row = [];
    let box = document.getElementById(parent);
    let mod = document.createElement('input');
    mod.setAttribute('type','number');
    box.appendChild(mod);
    box.addEventListener('keydown',(event) => {
        if (event.key === 'Enter') {
            this.universe = mod.value;
            console.log(this.universe);
        for (let a = 0; a < this.universe; a++) {
            let item = document.createElement('button');
            item.innerHTML = `${a}`;
            document.getElementById(parent).appendChild(item);
            let but = {
            'selected' : false,
            'clicker' : () => {
            item.addEventListener('mousedown',() => {
                but.selected = !but.selected;
                but.selected? this.row.push(a) : this.row = this.row.filter(x => x !== a);
                console.log(this.row);
            })
            but.clicker();
                    }
                }
            }
        }
    });
}

/**
 * Makes a grid using SVG. Used for Matrix Construction.
 * @param {array} data 2d array
 * @param {boolean} pitches  
 */
function Grid(data,pitches = false) {
    this.size = 50;
    this.offset = 20;
    let drawArea = this.size*data.length+this.offset*1.5;
    this.allCoordinates = [];
    this.draw = document.getElementById('drawing').value? "": SVG().addTo("#drawing").size(drawArea,drawArea);
    for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[y].length; x++) {
            let cell = this.draw.group();
            cell.translate((this.size*x)+this.offset,(this.size*y)+this.offset);
            let box = this.draw.rect(this.size,this.size,this.size,this.size).stroke({ width: 1, color: 'black' }).fill('white');
            let dat = this.draw.text(`${data[y][x]}`).center(this.size/2,this.size/2);
            cell.add(box);
            cell.add(dat);
            this.allCoordinates.push(this.cellData = {
                'box': box,
                'data': dat,
                'cell': cell,
                'row': x,
                'column': y,
                'selected': false,
                /** Determine if this is a label element.*/
                'labelEl': () => {
                    let result = false;
                    let char1 = data[y][x][0];
                    if (char1 == 'R' || char1 == 'P' || char1 == 'I' || char1 == ' ') {
                        result = true;
                    }
                    return result;
                }
            });
        }
    }
    this.allCoordinates.forEach(element => {
        if (element.labelEl == true) {
            element.box.stroke({color: 'white'});
            element.cell.click(() => {
                element.selected = !element.selected;
                element.selected == true? element.data.fill('red') : element.data.fill('black');
                //Figure out functionality here.
            });
        }
    })
}

//let L = new Inputs('input');
let Q = new Grid(Serialism.matrix([7,6,9,8,0,1,10,11,3,2,5,4],12,false,true));

})




 


