class Maze {
  maze = [];

  constructor() {
    this.initializeMaze();
  }

  /**
   * Translates cartesian to polar dimensions and calls wall constructor, then pushes constructed wall to maze
   */
  straightThinWall = function(pt1x, pt1y, pt2x, pt2y) {
    let centerX = (pt1x + pt2x) / 2;
    let centerY = (pt1y + pt2y) / 2;
    let xDist = pt1x - pt2x;
    let yDist = pt1y - pt2y;

    let height = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2)) + 10; //distance bw points + 10 (padding)
    let rotation = Math.atan(xDist/yDist);

    let wall = new Wall(createVector(centerX, centerY), 10, height, rotation);
    this.maze.push(wall);
  }

  initializeMaze = function() {
    // Default boundaries and walls
    let defaultWallCoords = [
        //Boundary
        [0, 0, 500, 0],
        [0, 0, 0, 500],
        [500, 0, 500, 500],
        [0, 500, 200, 500],
        [500, 500, 300, 500],

        //Internal
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

    defaultWallCoords.forEach(wall => this.straightThinWall(wall[0], wall[1], wall[2], wall[3]));

  }

}
