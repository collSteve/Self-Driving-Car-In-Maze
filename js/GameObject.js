/**
 * @author: @collSteve , @SaahirM
 * Desc: Physical object in game. Physical Game
 * 		 Objects come with physical properties, 
 * 		 a physics body, a sprite, a collider, an
 * 		 ID, and functions to mutate its motion
 * 		 attributes
 */

const MotionType = {
  Static:"static",
  Kinematic:"kinematic"
}


// dependence: P5.js Vector
class GameObject {
  running = false;
  position = createVector(0,0);
  rotation = 0;

  headingDirection = createVector(0,-1);

  static currID = 0;
  ID = GameObject.currID++;

  motionType = MotionType.Static;

  tag = "None"; // tag for distinguishing game objects

  sprite = new Sprite();
  collider = new Collider();

  // physics body (matter.js)
  body = Matter.Bodies.rectangle(this.position.x,this.position.y, this.sprite.size.width, this.sprite.size.height);

  bodyBinding = function() {
    this.body.gameObject = this;
  }

  // newPos is a vector
  moveTo = function(newPos) {
    if (this.motionType != MotionType.Static ) {
      this.position = newPos;
    }
  }
  // moveVector is a vector
  moveBy = function(moveVector) {
    if (this.motionType != MotionType.Static ) {
      this.position = p5.Vector.add(this.position, moveVector);
    }
  }

  setRotation = function(angle) {
    this.rotation = angle;
    this.sprite.rotation = angle;
    this.collider.rotation = angle;

    Matter.Body.setAngle(this.body, angle);

    this.headingDirection = createVector(Math.cos(angle), Math.sin(angle));
  }

  setDynamicAttribute = function(position, rotation, velocity, angularVelocity) {
    // position
    this.position.x = position.x;
    this.position.y = position.y;

    this.setRotation(rotation);

    Matter.Body.setPosition(this.body, {x:position.x,y:position.y});

    Matter.Body.setVelocity(this.body, {x:velocity.x,y:velocity.y});

    Matter.Body.setAngularVelocity(this.body, angularVelocity);
  }

  update = function(deltaTime) {

  }

  onCollision = function(e) {

  }
}
