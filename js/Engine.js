class Engine {
  gameMaze;
  gameObjects = [];

  physicsEngine;
  physicsEngineRunner;

  constructor(gameMaze=new Maze()) {
    // create physics Engine (matter.js)
    this.physicsEngine = Matter.Engine.create();
    this.physicsEngine.world.gravity.y = 0;
    this.physicsEngineRunner = Matter.Runner.create();
    Matter.Runner.run(this.physicsEngineRunner, this.physicsEngine)


    this.gameMaze = gameMaze;

     gameMaze.maze.forEach((wall, i) => {
       this.addGameObject(wall);
     });
  }

  run = function(deltaTime) {
    this.updateObjects(this.gameObjects, deltaTime); // return a json for storing updateProperties for each item

    // To-DO: Collision detector (detect collision in all gameObjects) [probably return json for colliding objects with its updateProperty]

    // To-Do: reverse movement if collide (recieve Json from collision detector)

    this.displayGameObjects(this.gameObjects);

  }

  displayGameObjects = function(objects) {
    // p5 js drawing
    rectMode(CENTER);

    objects.forEach((item, i) => {
      let pos = item.body.position; // changed to matter js body's position
      let size = item.sprite.size;
      let rotation = item.body.angle;

      push();
      translate(pos.x, pos.y); // translate to sprite's position
      rotate(rotation); // rotate the sprite

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
      });

  }

  addGameObject = function(obj) {
    this.gameObjects.push(obj);

    // put gameobject's physics body into engine world
    Matter.Composite.add(this.physicsEngine.world, obj.body);

  }
}
