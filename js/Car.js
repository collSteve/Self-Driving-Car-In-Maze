const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class Car extends GameObject {
  startPosition = createVector(0,0);

  maxSpeed = 5; // set up later
  maxTurnSpeed = 0.1;

  headingDirection = createVector(0,-1);

  States = {
    "Abstract State" : new CarState(this),
    "VisionState" : new VisionState(this),
    "ThinkState" : new ThinkState(this),
    "TurningMotionState" : new TurningMotionState(this),
    "TranslationMotionState" : new TranslationMotionState(this)

  }

  constructor(pos, width=0, height=0, rotation=0) {
    super();
    this.position = pos.copy();
    this.startPosition = pos.copy();


    this.tag = "Car";
    this.motionType = MotionType.Kinematic;

    this.sprite.spriteType = SpriteType.Rect;
    this.collider = new RectCollider();
    this.setSize(width, height);

    // physics (matter.js)
    this.body = Matter.Bodies.rectangle(this.position.x,this.position.y, width, height);

    this.body.frictionAir = 0.5; // large air friction
    this.setRotation(rotation);

    // event set up
    this.eventName = this.tage + this.ID;

    let initDataIn = {
      previousState: null,
      nextState: "VisionState",
      vision: null,
      deltaTime: 30/1000 // 30 frames per second
    };

    EventDispatcher.on(this.eventName, (e) => this.runState(e));

    // run
    let eventArg = {dataIn: initDataIn};
    EventDispatcher.emit(this.eventName, eventArg);
    console.log("set up finished");
  }

  setSize = function(width, height, rotation) {
    let widthRatio = width / this.collider.size.width;
    let heightRatio = height / this.collider.size.height;


    this.collider.size.width = width;
    this.collider.size.height = height;

    this.sprite.size.width = width;
    this.sprite.size.height = height;

    // reshape body (matter.js)
  ///  Matter.Body.scale(this.body, widthRatio, heightRatio);
  }

  // public interface
  update = function(deltaTime) {
    // let motionProperty = {
    //   speed:5,
    //   //direction:createVector(randomNum(-1, 1),randomNum(-1, 1))
    //   direction:createVector(0,-1)
    // };
    //
    // motionProperty.direction = motionProperty.direction.normalize();
    //
    // let turnAngle = Math.atan2(motionProperty.direction.y,motionProperty.direction.x)
    //         - Math.atan2(this.headingDirection.y,this.headingDirection.x);
    //
    //
    // // either turn or move
    // let error = 0.1;
    //
    // if (Math.abs(motionProperty.direction.y - this.headingDirection.y) > error ||
    //     Math.abs(motionProperty.direction.x - this.headingDirection.x) > error) {
    //       // turn
    //   this.turn(turnAngle, deltaTime);
    // }
    // else {
    //   // turn and move
    //   this.turn(turnAngle, deltaTime);
    //   this.move(motionProperty.speed, deltaTime);
    // }
  }

  async runState(e) {

    let dataIn = e.dataIn;
    let stateName = dataIn.nextState;

    let StateNow = this.States[stateName];

    StateNow.setInput(dataIn);

    let dataOut = await StateNow.run();

    console.log(StateNow.stateName + " Finished");

    let eventArg = {dataIn: dataOut};
    EventDispatcher.emit(this.eventName, eventArg); // trigger event

  }

  // v is a float, direction is a vector
  move = function(v, deltaTime) {
    let direction = this.headingDirection;

    // make sure speed does not exceed maximum speed
    if (v > this.maxSpeed) {
      v = this.maxSpeed;
    }
    else if (v < -this.maxSpeed) {
      v = -this.maxSpeed;
    }

    ///let moveVector = p5.Vector.mult(direction, v*deltaTime);
    let speedVector = {x:this.headingDirection.x * v,
                       y:this.headingDirection.y * v};

    //this.moveBy(moveVector);
    // matter.js move
    Matter.Body.setVelocity(this.body, speedVector);

    this.headingDirection = createVector(Math.cos(this.body.angle), Math.sin(this.body.angle));

    return {speed:v, direction:{x:direction.x, y:direction.y}};
  }

  turn = function(angularSpeed, deltaTime) {
    if (angularSpeed > this.maxTurnSpeed) {
      angularSpeed = this.maxTurnSpeed;
    }
    else if (angularSpeed < -this.maxTurnSpeed) {
      angularSpeed = -this.maxTurnSpeed;
    }

    // instant set angle (need change)
    Matter.Body.setAngle(this.body, this.body.angle + angularSpeed);

    this.headingDirection = createVector(Math.cos(this.body.angle), Math.sin(this.body.angle));
  }

  stop = function() {
    Matter.Body.setVelocity(this.body, {x:0,y:0});

    this.headingDirection = createVector(Math.cos(this.body.angle), Math.sin(this.body.angle));
  }
}

function randomNum(min, max) {
	return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
}

// possible States:
/*
dataStructure:
data =
{
  previousState:
  nextState:
  vision:

}
*/

/*
Event stateEndEvent;

stateEndEvent.addlistener(Run, e);

Run(e) {
    nextSate = e.nextState;

    dataOut = await nextSate(e.dataIn);

    //construct new e
    e.dataIn = dataOut;
    e.nextSate = dataOut.nextSate;

    trigger(stateEndEvent, e);
  }

const States = {
  "State1": State1,
  ....
}

*/

async function sampleState(dataIn) { // input: {previous: State1, vision:{}, ...}
  // input data process
  let previousState = input.previousState;
  // do sth

  // output contruct
  let dataOut = {};
  let vision = {};
  dataOut["nextState"] = State2;

  return await State2(dataOut);
}
