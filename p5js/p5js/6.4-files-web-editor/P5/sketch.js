// Adding JavaScript Files in p5.js Web Editor
// Code! Programming with p5.js
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/beginners/p5js/6.4-files-web-editor.html
// https://youtu.be/5nf41qLeagU
// https://editor.p5js.org/codingtrain/sketches/vcgtnfG7

let bubble1;
let bubble2;
let bubble3;

function setup() {
  createCanvas(600, 400);
  bubble1 = new Bubble(100, 200, 40);
  bubble2 = new Bubble(300, 200, 20);
  bubble3 = new Bubble(500, 120, 30);
}

function draw() {
  background(0);
  bubble1.move();
  bubble1.show(); bubble3.move();
  bubble3.show();
  bubble2.move();
  bubble2.show();
}
