class Car extends GameObject {
  startPosition = createVector(0,0);

  maxSpeed = 10; // set up later

  constructor(pos, width=0, height=0, rotation=0) {
    super();
    this.position = pos.copy();
    this.startPosition = pos.copy();


    this.tag = "Car";
    this.motionType = MotionType.Kinematic;

    this.sprite.spriteType = SpriteType.Rect;
    this.collider = new RectCollider();
    this.setSize(width, height, rotation);
  }

  setSize = function(width, height, rotation) {
    this.collider.size.width = width;
    this.collider.size.height = height;
    this.collider.rotation = rotation;

    this.sprite.size.width = width;
    this.sprite.size.height = height;
    this.sprite.rotation = rotation;

    this.rotation = rotation;
  }

  // public interface
  update = function(deltaTime) {
    let motionProperty = {speed:5, direction:createVector(0,-2)};

    this.move(motionProperty.speed, motionProperty.direction, deltaTime);

    // generation output data for the change
    let updateProperty = {motionProperty:motionProperty};

    return updateProperty;
  }

  // v is a float, direction is a vector
  move = function(v, rawDirection, deltaTime) {
    let rawDirMagnitude = Math.sqrt(Math.pow(rawDirection.x,2) + Math.pow(rawDirection.y,2));

    let direction = p5.Vector.mult(rawDirection, 1/rawDirMagnitude);



    // make sure speed does not exceed maximum speed
    if (v > this.maxSpeed) {
      v = this.maxSpeed;
    }
    else if (v < -this.maxSpeed) {
      v = -this.maxSpeed;
    }

    let moveVector = p5.Vector.mult(direction, v*deltaTime);

    this.moveBy(moveVector);

    return {speed:v, direction:{x:direction.x, y:direction.y}}
  }

}
