class Wall extends GameObject{
  constructor(pos, width=0, height=0, rotation=0) {
    super();
    this.position = pos.copy();
    this.setSize(width, height);
    this.rotation = rotation;

    this.tag = "Wall";

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
