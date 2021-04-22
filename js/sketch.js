let GameEngine;

function setup() {
  createCanvas(400, 400);
  GameEngine = new Engine();
}

function draw() {
  background(220);
  GameEngine.run();
}
