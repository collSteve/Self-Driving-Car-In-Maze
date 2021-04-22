const MotionType = {
  Static:"static",
  Kinematic:"kinematic"
}


// dependence: P5.js Vector
class GameObject {
  position = createVector(0,0);
  rotation = createVector(0,0);

  motionType = MotionType.Static;

  tag = "None"; // tag for distinguishing game objects

  sprite = new Sprite();
  collider = new Collider();

  moveTo = function(newPos) {
    if (this.motionType != MotionType.Static ) {
      this.position = newPos;
    }
  }

  moveBy = function(moveVector) {
    if (this.motionType != MotionType.Static ) {
      this.position = p5.Vector.add(this.position, moveVector);
    }
  }
}
