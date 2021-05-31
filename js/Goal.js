class Goal extends GameObject {

  constructor(pos, radius=0, rotation=0) {
    super();

    this.position = pos.copy();

    this.sprite.spriteType = SpriteType.Ellipse;
    this.sprite.colorProperty.fill = "green";
    this.sprite.colorProperty.stroke = "lime";
    this.collider = new CircleCollider();

    this.setSize(radius);

    this.tag = "Goal";

    this.body = Matter.Bodies.circle(this.position.x, this.position.y, radius, {isStatic:true});
    this.body.label = "Goal";
    this.setRotation(rotation);
    this.bodyBinding();

  }

  setSize = function(radius) {
    this.collider.size.radius = radius;

    this.sprite.size.width = radius * 2;
    this.sprite.size.height = radius * 2;
  }

}
