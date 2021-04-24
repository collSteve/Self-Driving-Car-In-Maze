const MotionType = {
  Static:"static",
  Kinematic:"kinematic"
}


// dependence: P5.js Vector
class GameObject {
  position = createVector(0,0);
  rotation = 0;

  motionType = MotionType.Static;

  tag = "None"; // tag for distinguishing game objects

  sprite = new Sprite();
  collider = new Collider();

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

  update = function(deltaTime) {
    
  }
}
