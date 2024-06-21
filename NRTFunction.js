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

document.addEventListener('DOMContentLoaded',() => {

let J = '';

function ScaleTheoryInput(parent) {
    this.data = {
        'Universe': null,
        'Generator': null,
        'Start': null,
        'Cardinality': null
    }
    let cont = document.createElement('div');
    let in1 = document.createElement('input');
    in1.setAttribute('type','number');
    in1.setAttribute('placeholder','Universe:');

    let in2 = document.createElement('input');
    in2.setAttribute('type','number');
    in2.setAttribute('placeholder','Start Element:');

    let in3 = document.createElement('input');
    in3.setAttribute('type','number');
    in3.setAttribute('placeholder','Generator:');

    let in4 = document.createElement('input');
    in4.setAttribute('type','number');
    in4.setAttribute('placeholder','Cardinality:');

    cont.appendChild(in1);
    cont.appendChild(in2);
    cont.appendChild(in3);
    cont.appendChild(in4);
    this.collection = []
    this.drawLines = (coordinates,generator,start,cardinality) => {
        this.collection = [];
        draw = J.draw;
        for (let a = 0; a < cardinality; a++) {
            let sel = (start+(a*generator))%coordinates.length
            this.collection.push(sel);
            J.allNodes[sel].circle.fill('red')
        }
        let polyline = draw.polyline().stroke({color: 'black', size: 1}).fill('none');
        let linearPath = this.collection.map(x => coordinates[x]);
        polyline.plot(linearPath);
        polyline.translate(J.center[0],J.center[1])
        console.log(this.collection);
    }
    cont.addEventListener('keypress',(event) => {
        if (event.key == 'Enter') {
            document.getElementById('drawing').innerHTML = '';
            this.data.Universe = parseInt(in1.value);
            this.data.Start = parseInt(in2.value);
            this.data.Generator = parseInt(in3.value);
            this.data.Cardinality = parseInt(in4.value);
            console.log(this.data);
            J = new Shape.MyPolygon([160,160],this.data.Universe,240,JSON.stringify(this.data),false,false,true);
            this.drawLines(J.points,this.data.Generator,this.data.Start,this.data.Cardinality);
        }
     })
    if (parent == undefined) {
        document.body.appendChild(cont);
    }
    else {
        document.getElementById(parent).appendChild(cont);
    }
}


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
     * Draws a regular polygon of of size (length). optionally rotate and label nodes.
     * @param {array} center [x,y]
     * @param {int} points
     * @param {string} label Any
     * @param {float} length 
     * @param {boolean} textRotate true = text rotates with shape || false = text doesn't rotate.
     * @param {float} length l of side.
     * @param {float} rotate Degrees to rotate.
     */
    MyPolygon: function (center,points = 3,length,label = '',textRotate = false,rotate = 0,showNodes = false) {
        this.drawArea = (points/10)*(length*20); //Who the heck knows.
        this.clicked = false;
        this.draw = document.getElementById('drawing').value? "": SVG().addTo("#drawing").size(this.drawArea,this.drawArea);
        this.center = center;
        this.angle = rotate;
        this.points = Shape.getPoints(center,points,length);
        this.cell = this.draw.group().translate(...this.center);
        this.shape = this.draw.polygon().stroke({ width: 1, color: 'black' }).fill('white');
        let text = this.draw.text(`${label}`).center(...this.center);
        textRotate == false? text.rotate(360-rotate) : text;
        this.nodeGrp = this.draw.group().translate(...this.center);
        this.allNodes = [];
        if (showNodes == true) {
        for (let a = 0; a < this.points.length; a++) {
            let mod = this.points.slice(0,this.points.length);
            let node = this.draw.group().translate(mod[a][0],mod[a][1]);
            let circ = this.draw.circle(20).fill('white').center(0,0).fill('white').stroke({width: 1, color: 'black'});
            let text = this.draw.text(`${a}`).center(0,0);
            let self = {
                'circle': circ,
            }
            this.allNodes.push(self);
            node.add(circ);
            node.add(text).rotate(360-rotate);  //Keep labels fixed in place.
            this.nodeGrp.add(node);
            }
        }
        this.shape.plot(this.points)
        this.cell.add(this.shape);
        this.cell.add(text)
        this.cell.rotate(rotate);
        this.nodeGrp.rotate(rotate);
        this.interaction = this.cell.click(() => {
            this.clicked = !this.clicked;
            this.clicked == true? this.shape.fill('red') : this.shape.fill('white');
        });
    },
    Implode: function (center,points = 3,length) {
        this.draw = document.getElementById('drawing').value? "": SVG().addTo("#drawing").size(drawArea,drawArea);
        
    },
    /**
     * Draws a lattice of triangles.
     * @param {array} labels 
     * @param {array} startCoord [x,y]
     * @param {float} polygonLength 
     * @param {int} numShapes
     */
    lattice: function (labels,startCoord,polygonLength,numShapes) {
        //this.draw = document.getElementById('drawing').value? "": SVG().addTo("#drawing").size(800,800);
        this.polygons = [];
        for (let a = 0; a < numShapes; a++) {
            x = startCoord[0]+a*(1.5*polygonLength);
            y = startCoord[1] + (a % 2 === 0 ? 0 : polygonLength * Math.sqrt(3) / 2);
            let poly = new Shape.MyPolygon([x,y],3,polygonLength,labels[a],false,0,false);
            this.polygons.push(poly);
        }
        return this.polygons;
    }    
}

H = ScaleTheoryInput('inps');

});
