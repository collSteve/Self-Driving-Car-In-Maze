class Wall extends GameObject{
  constructor(pos, width=0, height=0, rotation=0) {
    super();
    this.position = pos.copy();

    this.tag = "Wall";

    this.sprite.spriteType = SpriteType.Rect;
    this.sprite.colorProperty.fill = "black";
    this.sprite.colorProperty.stroke = "black";
    this.collider = new RectCollider();

    this.setSize(width, height);

    // physics (matter.js)
    this.body = Matter.Bodies.rectangle(this.position.x,this.position.y, width, height, {isStatic:true});
    this.body.label = "Wall";
    this.setRotation(rotation);

    this.bodyBinding();
  }

  setSize = function(width, height) {
    this.collider.size.width = width;
    this.collider.size.height = height;
    //this.collider.rotation = rotation;

    this.sprite.size.width = width;
    this.sprite.size.height = height;
    //this.sprite.rotation = rotation;
  }
}
