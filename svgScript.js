document.addEventListener('DOMContentLoaded', function() {
    // Create an SVG element
    let myS = document.createElement('svg');
    myS.setAttribute('id','drawing');
    document.body.appendChild(myS);

    // Create an SVG.js drawing
    let draw = SVG().addTo('#drawing').size(200, 200);

    // Draw a circle
    let circle = draw.circle(100).move(50, 50).fill('red');
});