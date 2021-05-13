/**
 * @author: @collSteve , @SaahirM
 * Desc: Collider for physical game objects.
 *       Behaves as object hitbox
 */

class Collider {
  size = {width:0, height:0};
  rotation = 0;

  isTrigger = false;
}

class RectCollider extends Collider {

}

class CircleCollider extends Collider {
  size = {radius:0};
}
