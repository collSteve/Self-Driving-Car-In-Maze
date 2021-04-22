class Car extends GameObject {
  startPosition = createVector(0,0);

  maxSpeed = 0; // set up later

  constructor(pos) {
    super();
    this.position = pos.copy();
    this.startPosition = pos.copy();

    this.tag = "Car";

    this.sprite.spriteType = SpriteType.Rect;
    this.collider = new RectCollider();
  }

  setSize = function(width, height) {
    this.collider.size.width = width;
    this.collider.size.height = height;

    this.sprite.size.width = width;
    this.sprite.size.height = height;
  }

}
