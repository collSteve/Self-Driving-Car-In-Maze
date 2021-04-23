let GameEngine, GameMaze, GameCar;

function setup() {
  createCanvas(500, 500);
  GameMaze = new Maze();

  GameCar = new Car(createVector(250,450), 20, 20, Math.PI/2);
  GameCar.sprite.colorProperty.fill = "blue";
  GameCar.sprite.colorProperty.stroke = "white";

  GameEngine = new Engine(GameMaze);

  GameEngine.addGameObject(GameCar);
}

function draw() {
  background(220);
  GameEngine.run();
}
