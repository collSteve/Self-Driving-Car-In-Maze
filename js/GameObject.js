const MotionType = {
  Static:"static",
  Kinematic:"kinematic"
}


// dependence: P5.js Vector
class GameObject {
  this.position = createVector(0,0);
  this.rotation = createVector(0,0);

  this.motionType = MotionType.Static;

  this.Sprite = new Sprite();
  this.collider = new Collider();

  moveTo = function(newPos) {
    if (this.motionType != MotionType.Static ) {
      this.position = newPos;
    }
  }

  moveBy = function(moveVector) {
    if (this.motionType != MotionType.Static ) {
      this.position = p5.Vector.add(this.position, moveVector)
    }
  }
}
