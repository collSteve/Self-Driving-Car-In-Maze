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

class CarState {
  stateName = "Abstract State";
  previousState = null;
  dataIn = null;

  gameObject = null;

  constructor(gameObject) {
    this.gameObject = gameObject;
  }

  async run() {
    // do sth
    console.log("Running "+ this.stateName);

    // output construct
    let dataOut = JSON.parse(JSON.stringify(this.dataIn)); // deep copy

    dataOut["previousState"] = this.stateName;
    dataOut["nextSate"] = "Abstract State"; // loop back: change later
    //return dataOut;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(dataOut);
      }, 5000); // take 5s to return
    });
  }

  setInput = function(dataIn) {
    this.dataIn = JSON.parse(JSON.stringify(dataIn)); // deep copy
    this.previousState = dataIn["previousState"];
  }
}

class VisionState extends CarState {
  constructor(gameObject) {
    super(gameObject);
    this.stateName = "VisionState";
  }

  async run() {
    // To-Do: see
    console.log("Running "+ this.stateName);

    await sleep(1000);

    let vision = this.gameObject.see();

    // output construct
    let dataOut = JSON.parse(JSON.stringify(this.dataIn)); // deep copy

    dataOut.previousState = this.stateName;
    dataOut.nextState = "ThinkState";
    dataOut.vision = vision;

    return dataOut;
  }
}


class ThinkState extends CarState {
  constructor(gameObject) {
    super(gameObject);
    this.stateName = "ThinkState";
  }

  async run() {
    // data processing
    let currentPos = this.gameObject.body.position;

    // To-Do: think
    console.log("Running "+ this.stateName);

    let demands = {};

    // sample data
    demands.motionDemands = {
      nextTargetPoint: {x: currentPos.x + randomNum(-80,80),
                        y:currentPos.y + randomNum(-80,80)}
    };

    // output construct
    let dataOut = JSON.parse(JSON.stringify(this.dataIn)); // deep copy

    dataOut.previousState = this.stateName;
    dataOut.nextState = "TurningMotionState";
    dataOut.brainDemands = demands;

    await sleep(5000);

    return dataOut;
  }
}

class TurningMotionState extends CarState {
  constructor(gameObject) {
    super(gameObject);
    this.stateName = "TurningMotionState";

    this.turningError = 0.1;
  }

  async run() {
    // To-Do: think
    console.log("Running "+ this.stateName);

    // data processing
    let demands = JSON.parse(JSON.stringify(this.dataIn.brainDemands));
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
    let dataOut = JSON.parse(JSON.stringify(this.dataIn)); // deep copy

    dataOut.previousState = this.stateName;

    // figure out the next state
    if (angleWithinError) {
      dataOut.nextState = "TranslationMotionState";
    }
    else {
      dataOut.nextState = "TurningMotionState";
    }

    dataOut.movementData = movementData;

    await sleep(this.dataIn.deltaTime);

    return dataOut;
  }
}

class TranslationMotionState extends CarState {
  constructor(gameObject) {
    super(gameObject);
    this.stateName = "TranslationMotionState";
    this.distanceError = 5;
  }

  async run() {
    // To-Do: see
    console.log("Running "+ this.stateName);

    // data processing
    let demands = JSON.parse(JSON.stringify(this.dataIn.brainDemands));
    let motionDemands = demands.motionDemands;
    let nextTargetPoint = motionDemands.nextTargetPoint;
    let pos =this.gameObject.body.position;

    // move
    let speed = Math.sqrt(Math.pow(nextTargetPoint.x-pos.x,2) + Math.pow(nextTargetPoint.y-pos.y,2)); // need changing
    this.gameObject.move(speed, this.dataIn.deltaTime);


    let currentPos = this.gameObject.body.position;
    let distanceDiff = Math.sqrt((currentPos.x - nextTargetPoint.x)*(currentPos.x - nextTargetPoint.x) +
                                 (currentPos.y - nextTargetPoint.y)*(currentPos.y - nextTargetPoint.y));

    // output construct
    let dataOut = JSON.parse(JSON.stringify(this.dataIn)); // deep copy

    if (distanceDiff < this.distanceError) {
      this.gameObject.stop();
      dataOut.nextState = "VisionState";
    }
    else {
      dataOut.nextState = "TurningMotionState";
    }

    dataOut.previousState = this.stateName;

    await sleep(this.dataIn.deltaTime);

    return dataOut;
  }
}
