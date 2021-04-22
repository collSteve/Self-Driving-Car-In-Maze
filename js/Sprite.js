const SpriteType = {
  Rect:"rect",
  Ellipse: "ellipse",
  Image: "image"
}

class Sprite {
  spriteType = SpriteType.Rect;
  size = {width:0, height:0}; //default
}
