class Maze {
  maze = [];

  constructor() {
    this.initializeMaze();
  }

  initializeMaze = function() {
    let wall1 = new Wall(createVector(100,50), 100, 20);
    let wall2 = new Wall(createVector(100,50), 100, 20, Math.PI/2);
    let wall3 = new Wall(createVector(250,350), 100, 20);
    let wall4 = new Wall(createVector(300,300), 100, 20, -Math.PI/4);

    this.maze.push(wall1);
    this.maze.push(wall2);
    this.maze.push(wall3);
    this.maze.push(wall4);


  }

}
