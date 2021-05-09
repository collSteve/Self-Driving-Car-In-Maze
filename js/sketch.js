let GameEngine, GameMaze, GameCar;

function setup() {
  createCanvas(500, 500);
  GameMaze = new Maze();

  GameCar = new Car(createVector(250,450), 20, 20, -Math.PI/2);
  GameCar.sprite.colorProperty.fill = "blue";
  GameCar.sprite.colorProperty.stroke = "white";

  GameCar2 = new Car(createVector(200,150), 20, 20, Math.PI/2);
  GameCar2.sprite.colorProperty.fill = "blue";
  GameCar2.sprite.colorProperty.stroke = "white";

  GameEngine = new Engine(GameMaze);

  GameEngine.addGameObject(GameCar);
  GameEngine.addGameObject(GameCar2);
}

function draw() {
  background(220);

  GameEngine.run(deltaTime);
}

function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}
