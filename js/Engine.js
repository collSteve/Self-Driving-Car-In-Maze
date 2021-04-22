class Engine {
  gameMaze = new Maze();
  gameObjects = [];

  constructor() {
  }

  run = function() {
    this.displayGameObjects(this.gameObjects);
  }

  displayGameObjects = function(objects) {

    // p5 js drawing
    objects.forEach((item, i) => {
      let pos = item.position.copy();
      let size = item.sprite.size;

      if (item.sprite.spriteType == SpriteType.Rect) {
        rect(pos.x, pos.y, size.width, size.height);
      }
      else if (item.sprite.spriteType == SpriteType.Ellipse) {
        ellipse(pos.x, pos.y, size.width, size.height);
      }
    });

  }
}
