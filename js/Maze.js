class Maze {
  maze = [];

  constructor() {
    this.initializeMaze();
  }

  /**
   * Translates cartesian to polar dimensions and calls wall constructor
   * Only for strcitly vertical/horizontal walls
   * Returns constructed wall
   */
  createWall = function(pt1x, pt1y, pt2x, pt2y) {
    let centerX = (pt1x + pt2x) / 2;
    let centerY = (pt1y + pt2y) / 2;

    let width = Math.abs(pt1x - pt2x) + 10;
    let height = Math.abs(pt1y - pt2y) + 10;

    let rotation = 0;
    if (pt1x == pt2x) {
      rotation = 0; //????, not Math.PI / 2; ??
    }


    let wall = new Wall(createVector(centerX, centerY), width, height, rotation);
    return wall;
  }

 /**
  * Obtains wall coordinates from given list and applies createWall() function on each, then pushes constructed wall to maze
  */
  createWallsFrom = function(list) {
    for (let coords of list) {
      let wall = this.createWall(coords[0], coords[1], coords[2], coords[3]);
      this.maze.push(wall);
    }
  }

  initializeMaze = function() {
    // Preserved for debugging purposes
    // let wall1 = new Wall(createVector(100,50), 100, 20);
    // let wall2 = new Wall(createVector(100,50), 100, 20, Math.PI/2);
    // let wall3 = new Wall(createVector(250,350), 100, 20);
    // let wall4 = new Wall(createVector(300,300), 100, 20, -Math.PI/4);
    //
    // this.maze.push(wall1);
    // this.maze.push(wall2);
    // this.maze.push(wall3);
    // this.maze.push(wall4);

    // Default boundaries and walls
    let boundaryCoords = [
        [0, 0, 500, 0],
        [0, 0, 0, 500],
        [500, 0, 500, 500],
        [0, 500, 200, 500],
        [500, 500, 300, 500]
    ];
    let wallCoords = [
        [400, 0, 400, 200],
        [100, 100, 300, 100],
        [0, 200, 100, 200],
        [200, 200, 300, 200],
        [100, 200, 100, 400],
        [200, 200, 200, 300],
        [200, 300, 500, 300],
        [100, 400, 200, 400],
        [300, 400, 400, 400],
        [300, 400, 300, 500]
    ];

    this.createWallsFrom(boundaryCoords);
    this.createWallsFrom(wallCoords);

  }

}
