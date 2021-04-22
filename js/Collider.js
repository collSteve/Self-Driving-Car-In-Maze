class Collider {
  size = {width:0, height:0};

  isTrigger = false;
}

class RectCollider extends Collider {

}

class CircleCollider extends Collider {
  size = {radius:0};
}
