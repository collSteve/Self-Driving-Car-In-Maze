class Wall extends GameObject{
  constructor(pos, width=0, height=0, rotation=0) {
    super();
    this.position = pos.copy();

    this.tag = "Wall";

    this.sprite.spriteType = SpriteType.Rect;
    this.sprite.colorProperty.fill = "black";
    this.sprite.colorProperty.stroke = "black";
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
}
