/*
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

let debugObj = [];

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
    console.log("Running "+ this.stateName + this.gameObject.eventName);

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
    console.log("Running "+ this.stateName + this.gameObject.eventName);

    await sleep(1000);

    let vision = this.gameObject.see();
    console.log(vision); //TEMP

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
    console.log("Running "+ this.stateName + this.gameObject.eventName);

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
    console.log("Running "+ this.stateName + this.gameObject.eventName);

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
    this.stuckTimeRange = 10/1000;
  }

  async run() {
    // To-Do: see
    console.log("Running "+ this.stateName + this.gameObject.eventName);

    // data processing
    let previousPosition, previousSpeed;
    if (!this.dataIn.previousPosition){
      previousPosition = {x:this.gameObject.startPosition.x,y:this.gameObject.startPosition.y};
    }
    else {
      previousPosition = JSON.parse(JSON.stringify(this.dataIn.previousPosition));
    }

    if (!this.dataIn.previousSpeed){
      previousSpeed = 0;
    }
    else {
      previousSpeed = JSON.parse(JSON.stringify(this.dataIn.previousSpeed));
    }

    let demands = JSON.parse(JSON.stringify(this.dataIn.brainDemands));
    let motionDemands = demands.motionDemands;
    let nextTargetPoint = motionDemands.nextTargetPoint;
    let pos =this.gameObject.body.position;

    // move
    let beforeMovePosition = {x:this.gameObject.body.position.x,y:this.gameObject.body.position.y};
    let beforeTime = Date.now();

    let speed = dist2D(nextTargetPoint, beforeMovePosition); // need changing
    this.gameObject.move(speed, this.dataIn.deltaTime);

    await sleep(this.dataIn.deltaTime); // move for this amount of time

    let currentPos = this.gameObject.body.position;
    let targetDistanceDiff = dist2D(currentPos, nextTargetPoint);

    let movedDistance = dist2D(currentPos, beforeMovePosition);

    // output construct
    let dataOut = JSON.parse(JSON.stringify(this.dataIn)); // deep copy

    let currTime = Date.now();
    let realSpeed = speed/(this.dataIn.engineTime);

    if (movedDistance < realSpeed * (currTime - beforeTime)/1000) {
      this.gameObject.stop();
      dataOut.nextState = "VisionState";

      console.log("Stucked", currTime - beforeTime);
      console.log(movedDistance, "<", realSpeed * (currTime - beforeTime));

      speed = 0;
    }

    else if (targetDistanceDiff < this.distanceError) {
      this.gameObject.stop();
      dataOut.nextState = "VisionState";
      speed = 0;
    }
    else {
      dataOut.nextState = "TurningMotionState";
    }

    dataOut.previousState = this.stateName;

    return dataOut;
  }
}
