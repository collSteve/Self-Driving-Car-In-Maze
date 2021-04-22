let GameEngine, GameMaze, GameCar;

function setup() {
  createCanvas(400, 400);
  GameMaze = new Maze();

  GameCar = new Car(createVector(0,0), 20,20,0);
  GameCar.sprite.colorProperty.fill = "blue";
  GameCar.sprite.colorProperty.stroke = "white";

  GameEngine = new Engine(GameMaze);

  GameEngine.addGameObject(GameCar);
}

function draw() {
  background(220);
  GameEngine.run();
}
