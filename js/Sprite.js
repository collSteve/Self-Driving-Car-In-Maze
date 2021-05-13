/**
 * @author: @collSteve , @SaahirM
 * Desc: Sprite for Game Objects (controlling
 *       their appearance on screen)
 */

const SpriteType = {
  Rect:"rect",
  Ellipse: "ellipse",
  Image: "image"
}

class Sprite {
  spriteType = SpriteType.Rect;
  size = {width:0, height:0}; //default
  rotation = 0;

  colorProperty = {fill:"white", stroke:"black"};
}
