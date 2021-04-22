class Maze {
  maze = [];

  constructor() {
    let wall1 = new Wall(createVector(20,20), width=100, height=20);
    let wall2 = new Wall(createVector(40,20), width=100, height=20, rotation=Math.PI/2);
    let wall3 = new Wall(createVector(20,100), width=100, height=20);
    let wall4 = new Wall(createVector(20,100), width=100, height=20, rotation=Math.PI/2);

    maze.push(wall1);
    maze.push(wall2);
    maze.push(wall3);
    maze.push(wall4);
  }

}
