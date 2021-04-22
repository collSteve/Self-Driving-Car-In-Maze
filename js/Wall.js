class Wall extends GameObject{
  constructor(pos) {
    super();
    this.position = pos.copy();
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
