//const { SVG, Circle } = require("@svgdotjs/svg.js");

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Loaded!');
});

/**
 * Simple corrected algorithm for the modulo operation.
 * @param {int} value 
 * @param {int} modulus 
 * @returns int
 */
const modulo = (value, modulus) => {
    let temp = value%modulus;
    if (temp >= 0) {
        return temp;
    }
    else {
        return modulus+temp;
    }
};
/**
 * 
 * @param {string} label 
 * @param {string} id 
 * @param {string} type 
 * @param  {...any} values 
 */
function Dropdown(label,id,type,...values) {
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
    document.body.appendChild(lab);
    document.body.appendChild(ddown);
    document.body.appendChild(dis);
    dis.innerHTML = `Modulo ${this.selection}:`
    document.addEventListener('click', (event) => {
        if (type == 'number' && event.target == ddown) {
            this.selection = parseInt(event.target.value);
            console.log(this.selection);
        }
        else if (type == 'text' && event.target == ddown) {
            this.selection = event.target.value;
        }
        else if (event.target !== ddown) {
            //Don't do anything!
        }
        dis.innerHTML = `Modulo ${this.selection}:`
    });
}

/**
 * Constructor for an ArrayInput object. Creates an input box. Allows keypresses 'Enter' and 'Backspace'.
 * @param {string} label
 * @param {string} type = "number"/"text";
 * @param {string} id 
 */
function ArrayInput(label,type,id) {        //make storage a property.
    this.elements = [];
    this.as_set = function () {
        return Array.from(new Set(this.elements.map(x => modulo(x,drop.selection)).sort((a,b) => a-b)));
    };
    let inp = document.createElement('input');
    let labl = document.createElement('p');
    labl.innerHTML = `${label}`;
    inp.setAttribute('id',`${id}`);
    inp.setAttribute('placeholder',`${type.toUpperCase()}`);
    let display = document.createElement('div');
    display.setAttribute('id',`${id}dis`);
    display.innerHTML = `Array: []`;
    document.body.appendChild(labl);
    document.body.appendChild(inp);
    document.body.appendChild(display);
    document.addEventListener('keydown',(event) => {
        let possible = document.getElementById(`${id}`).value;
        if (event.key === 'Enter') {
            if (type == 'number' && /^[0-9]+/.test(possible) == true) {
                this.elements.push(parseInt(possible));
                console.log(this.as_set());
            }
            else if (type == 'number' && /^[0-9]+/.test(possible) == false) {
                alert('Invalid!');
            }
            else {
                this.elements.push(possible);
            }
            document.getElementById(`${id}`).value = '';
            let out = `Array: [${this.as_set()}]`
            display.innerHTML = out;
        }
        else if (event.key === 'Backspace' && document.getElementById(`${id}`).value == '') { //if empty, remove last element from storage.
            let lastChar = this.elements[this.elements.length-1];//this.elements.pop();
            this.elements = this.elements.filter(x => x !== lastChar);
            console.log(this.elements)
            let out = `Array: [${this.as_set()}]`;
            display.innerHTML = out;
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
function ConstructTable(array,labels = null) {
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
    document.body.appendChild(table);
};

let drop = new Dropdown('Select Modular Universe:','ba','number',2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24);
let arr = new ArrayInput('Input Array Elements:','number','blah');


