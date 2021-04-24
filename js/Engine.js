class Engine {
  gameMaze;
  gameObjects = [];

  constructor(gameMaze=new Maze()) {
    this.gameMaze = gameMaze;

    this.gameObjects = gameMaze.maze.concat([]); // better implement deep copy later
  }

  run = function(deltaTime) {
    this.updateObjects(this.gameObjects, deltaTime);
    this.displayGameObjects(this.gameObjects);

  }

  displayGameObjects = function(objects) {
    // p5 js drawing
    rectMode(CENTER);

    objects.forEach((item, i) => {
      let pos = item.position.copy();
      let size = item.sprite.size;

      push();
      translate(pos.x, pos.y); // translate to sprite's position
      rotate(item.sprite.rotation); // rotate the sprite

      // set colorProperty
      fill(item.sprite.colorProperty.fill);
      stroke(item.sprite.colorProperty.stroke);

      if (item.sprite.spriteType == SpriteType.Rect) {
        rect(0, 0, size.width, size.height);
      }
      else if (item.sprite.spriteType == SpriteType.Ellipse) {
        ellipse(0, 0, size.width, size.height);
      }

      pop();
    });
  }

  updateObjects = function(objects, deltaTime) {
    objects.forEach((item, i) => {
        item.update(deltaTime/100);
      }
    )

  }

  addGameObject = function(obj) {
    this.gameObjects.push(obj);
  }
}
