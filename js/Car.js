class Car extends GameObject {
  startPosition = createVector(0,0);

  maxSpeed = 10; // set up later
  maxTurnSpeed = 0.5;

  headingDirection = createVector(0,-1);

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
    this.setRotation(rotation);
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
    let motionProperty = {
      speed:5,
      //direction:createVector(randomNum(-1, 1),randomNum(-1, 1))
      direction:createVector(0,-1)
    };

    // first turning, then moving
    let turnAngle = Math.atan2(motionProperty.direction.y,motionProperty.direction.x)
            - Math.atan2(this.headingDirection.y,this.headingDirection.x);

    this.turn(turnAngle, deltaTime);
    let realMotionProperty = this.move(motionProperty.speed, deltaTime);

    // generation output data for the change
    let updateProperty = {motionProperty:realMotionProperty};

    return updateProperty;
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
    let moveVector = p5.Vector.mult(direction, v);

    //this.moveBy(moveVector);
    // matter.js move
    Matter.Body.setVelocity(this.body, moveVector);

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
    Matter.Body.setAngularVelocity(this.body, angularSpeed);

    this.headingDirection = createVector(Math.cos(this.body.angle), Math.sin(this.body.angle));


    // let x = this.headingDirection.x;
    // let y = this.headingDirection.y
    // this.headingDirection.x = x*Math.cos(angularSpeed*deltaTime)-y*Math.sin(angularSpeed*deltaTime);
    // this.headingDirection.y = x*Math.sin(angularSpeed*deltaTime)+y*Math.cos(angularSpeed*deltaTime);
    //
    // this.headingDirection.normalize();
    //
    // // set Rotation
    // this.setRotation(Math.atan2(this.headingDirection.y, this.headingDirection.x));

  }

}

function randomNum(min, max) {
	return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
}
