/**
 * @author: @collSteve , @SaahirM
 * Desc: Class with details about what states the Car can
 * 		 be in, and how they work.
 */

/*
- State template -

dataStructure:
data =
{
  previousState:
  nextState:
  vision:
  deltaTime:
  brainDemands: {
                  nextTargetPoint:
                }
  movementData:
}
*/
// TO-DO: update state's constructors
let debugObj = [];

class CarState {
  stateName = "Abstract State";
  previousState = null;
  dataIn = null;

  stateIn = {};
  stateOut = {
    S0:"VisionState"
  };

  gameObject = null;

  nextState = null;

  constructor(gameObject) {
    this.gameObject = gameObject;
  }

  generateDataOut = function() {
    // output construct
    let dataOut = deepCopy(this.dataIn); // deep copy

    dataOut.previousState = this.stateName;
    dataOut.nextState = this.stateOut.S0; // loop back: change later
    return dataOut;
  }

  async run() {
    // do sth
    console.log("Running "+ this.stateName + this.gameObject.eventName);
    this.gameObject.memory.stateInfo.currentState = this.stateName;

    let dataOut = this.generateDataOut();

    this.gameObject.memory.stateInfo.nextState = dataOut.nextState;

    return dataOut;
  }

  setInput = function(dataIn) {
    this.dataIn = deepCopy(dataIn); // deep copy
    this.previousState = dataIn["previousState"];
  }
}

class VisionState extends CarState {
  constructor(gameObject) {
    super(gameObject);
    this.stateName = "VisionState";

    this.stateOut.S0 = "ThinkState";
  }

  async run() {
    // To-Do: see
    console.log("Running "+ this.stateName + this.gameObject.eventName);
    this.gameObject.memory.stateInfo.currentState = this.stateName;

    await sleep(1000);

    let vision = this.gameObject.see();

    // store vision
    vision.forEach((item, i) => {
      if (item.obstacle == "Wall") {
        this.gameObject.memory.addObstacleHitPoint(deepCopy(item));
      }
    });

    this.gameObject.memory.vision = deepCopy(vision);

    // output construct
    let dataOut = deepCopy(this.dataIn); // deep copy

    dataOut.previousState = this.stateName;
    dataOut.nextState = this.stateOut.S0;
    dataOut.vision = vision;

    this.gameObject.memory.stateInfo.nextState = dataOut.nextState;

    return dataOut;
  }
}


class ThinkState extends CarState {
  constructor(gameObject) {
    super(gameObject);
    this.stateName = "ThinkState";

    this.stateOut.MotionState = "TurningMotionState";
    this.stateOut.GoalState = null;
  }

  async run() {
    // data processing
    let currentPos = this.gameObject.body.position;

    // To-Do: think
    console.log("Running "+ this.stateName + this.gameObject.eventName);
    this.gameObject.memory.stateInfo.currentState = this.stateName;

    let demands = {};

    // sample data
    demands.motionDemands = {
      nextTargetPoint: {x: currentPos.x + randomNum(-50,50),
                        y:currentPos.y + randomNum(-50,50)}
      // nextTargetPoint: {x: currentPos.x ,
      //                   y:currentPos.y - 50}
    };

    debugObj.push({type:"point", pos:{x:demands.motionDemands.nextTargetPoint.x,
                                      y:demands.motionDemands.nextTargetPoint.y}});

    // store demands to memory
    this.gameObject.memory.brainDemand = demands;

    // output construct
    let dataOut = deepCopy(this.dataIn); // deep copy

    dataOut.previousState = this.stateName;
    dataOut.nextState = this.stateOut.MotionState;
    dataOut.brainDemands = demands;

    await sleep(5000);

    this.gameObject.memory.stateInfo.nextState = dataOut.nextState;
    return dataOut;
  }
}

class TurningMotionState extends CarState {
  constructor(gameObject) {
    super(gameObject);
    this.stateName = "TurningMotionState";

    this.turningError = 0.1;

    this.stateOut.TranslationMotionState = "TranslationMotionState";
    this.stateOut.TurningMotionState = "TurningMotionState";
  }

  async run() {
    // To-Do: think
    console.log("Running "+ this.stateName + this.gameObject.eventName);
    this.gameObject.memory.stateInfo.currentState = this.stateName;


    // data processing
    let demands = deepCopy(this.gameObject.memory.brainDemand);
    let motionDemands = demands.motionDemands;
    let nextTargetPoint = motionDemands.nextTargetPoint;

    let objPos = this.gameObject.body.position;
    let direction = createVector(nextTargetPoint.x-objPos.x, nextTargetPoint.y-objPos.y).normalize();

    // movement
    let turnAngle = Math.atan2(direction.y,direction.x)
            - Math.atan2(this.gameObject.headingDirection.y,this.gameObject.headingDirection.x);

    this.gameObject.turn(turnAngle, this.dataIn.deltaTime);

    let angleWithinError = Math.abs(direction.y - this.gameObject.headingDirection.y) <= this.turningError ||
                             Math.abs(direction.x - this.gameObject.headingDirection.x) <= this.turningError;

    // output construct
    let movementData = {};
    let dataOut = deepCopy(this.dataIn); // deep copy

    dataOut.previousState = this.stateName;

    // figure out the next state
    if (angleWithinError) {
      dataOut.nextState = this.stateOut.TranslationMotionState;
    }
    else {
      dataOut.nextState = this.stateOut.TurningMotionState;
    }

    dataOut.movementData = movementData;

    await sleep(this.dataIn.deltaTime);
    this.gameObject.memory.stateInfo.nextState = dataOut.nextState;

    return dataOut;
  }
}

class TranslationMotionState extends CarState {
  constructor(gameObject) {
    super(gameObject);
    this.stateName = "TranslationMotionState";
    this.distanceError = 5;
    this.stuckTimeRange = 10/1000;
    this.stuckSpeedRange = 0.1;

    this.stateOut.TurningMotionState = "TurningMotionState";
    this.stateOut.VisionState = "VisionState";
  }

  decideNextState = function(isStuck, reachedTarget) {
    let nextState = null;
    if (isStuck) {
      nextState = this.stateOut.VisionState;

      console.log("Stucked");
      //console.log(this.gameObject.body.speed/this.gameObject.body.frictionAir, "<", realSpeed - this.stuckSpeedRange);

      this.gameObject.stop();
      this.gameObject.memory.isStuck = false;
    }
    else if (reachedTarget) {
      this.gameObject.stop();
      nextState = this.stateOut.VisionState;
    }
    else {
      nextState = this.stateOut.TurningMotionState;

      // console.log(this.gameObject.body.speed/this.gameObject.body.frictionAir, "vs", realSpeed - this.stuckSpeedRange);
      // console.log(currentPos, beforeMovePosition);
    }
    return nextState;
  }

  async run() {
    // To-Do: see
    console.log("Running "+ this.stateName + this.gameObject.eventName);
    this.gameObject.memory.stateInfo.currentState = this.stateName;

    // data processing
    let previousPosition, previousSpeed;
    if (!this.dataIn.previousPosition){
      previousPosition = {x:this.gameObject.startPosition.x,y:this.gameObject.startPosition.y};
    }
    else {
      previousPosition = deepCopy(this.dataIn.previousPosition);
    }

    if (!this.dataIn.previousSpeed){
      previousSpeed = 0;
    }
    else {
      previousSpeed = deepCopy(this.dataIn.previousSpeed);
    }

    let demands = deepCopy(this.dataIn.brainDemands);
    let motionDemands = demands.motionDemands;
    let nextTargetPoint = motionDemands.nextTargetPoint;
    let pos =this.gameObject.body.position;

    // move
    let beforeMovePosition = {x:this.gameObject.body.position.x,y:this.gameObject.body.position.y};
    let beforeTime = Date.now();

    let speed = dist2D(nextTargetPoint, beforeMovePosition); // need changing
    let realSpeed = this.gameObject.move(speed, this.dataIn.deltaTime).speed;

    await sleep(this.dataIn.deltaTime); // move for this amount of time

    let currentPos = this.gameObject.body.position;
    let targetDistanceDiff = dist2D(currentPos, nextTargetPoint);

    let movedDistance = dist2D(currentPos, beforeMovePosition);

    // output construct
    let dataOut = deepCopy(this.dataIn); // deep copy

    let currTime = Date.now();

    // To-Do: change isStuck logic
    //let isStuck = this.gameObject.body.speed / this.gameObject.body.frictionAir < realSpeed - this.stuckSpeedRange;
    let isStuck = this.gameObject.memory.isStuck;
    let reachedTarget = targetDistanceDiff < this.distanceError;

    let nextState = this.decideNextState(isStuck, reachedTarget);

    dataOut.nextState = nextState;

    // store Memory
    this.gameObject.memory.addPreviousPosition(currentPos);
    dataOut.previousState = this.stateName;

    this.gameObject.memory.stateInfo.nextState = dataOut.nextState;
    return dataOut;
  }
}
