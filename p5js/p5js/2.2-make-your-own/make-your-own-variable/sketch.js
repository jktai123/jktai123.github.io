// Make Your Own (Make Your Own Variable)
// Code! Programming with p5.js
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/beginners/p5js/2.2-make-your-own.html
// https://youtu.be/dRhXIIFp-ys

// Make Your Own Variable: https://editor.p5js.org/codingtrain/sketches/xPXNdPy17
// Growing Circle Exercise: https://editor.p5js.org/codingtrain/sketches/ehbMJ-otC

let circleX = 100;circleY= 30;

function setup() {
  createCanvas(400, 300);
}

function mousePressed() {
  circleX = 0;
  circleY = 10;
}

function draw() {
  background(0);
  noStroke();
  fill(25,122,122);
  //circle(circleX, 150, 64);
  circle(circleX, circleY, 64);
  circleX = circleX + 1;
  circleY = circleY + 1;
  if(circleX>400){
    circleX=1;
    circleY=50;
    }
  if(circleY>300){
    circleX=10;
    circleY=20;
    
  }
}
