class Memory {
  previousPosition;

  // obstacle Observed
  maxObstacleHitPointsStorage = 500;
  obstacleHitPoints = [];

  // previous positions
  maxPreviousPositionsStorage = 100;
  previousPositions = [];

  idealPath = [];

  goalObjects = [];

  vision = null;

  brainDemand = null;

  stateInfo = {
    currentState: null,
    nextState: null,
    // initial State DataIn:
    stateDataOut: {
      previousState: null,
      nextState: "VisionState",
      vision: null,
      deltaTime: 1000/60, // 30 frames per second
      engineTime: 1000/60
    }
  };

  maxCollidedObjectsStorage = 50;
  collided = false;
  collidedObjects = [];

  reachedGoal = false;

  addPreviousPosition = function(position) {
    this.previousPosition = deepCopy(position);
    if (this.previousPositions.length >= this.maxPreviousPositionsStorage) {
      // remove oldest collided object
      this.previousPositions.shift(); // remove from start
    }
    this.previousPositions.push(deepCopy(position));
  }

  addObstacleHitPoint = function(obstacle) {
    if (this.obstacleHitPoints.length >= this.maxObstacleHitPointsStorage) {
      // remove oldest collided object
      this.obstacleHitPoints.shift(); // remove from start
    }
    this.obstacleHitPoints.push(obstacle);
  }

  addCollidedObject = function(obj) {
    if (this.collidedObjects.length >= this.maxCollidedObjectsStorage) {
      // remove oldest collided object
      this.collidedObjects.shift(); // remove from start
    }
    this.collidedObjects.push(obj);
  }
}
