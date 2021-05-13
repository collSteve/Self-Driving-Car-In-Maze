/**
 * @author: @collSteve , @SaahirM
 * Desc: Back-end engine object which handles:
 *       - Initializing physics engine (Matter.js)
 *       - Storing all game objects
 *       - Displaying all game objects
 */

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

    Matter.Runner.run(this.physicsEngineRunner, this.physicsEngine);

    this.gameMaze = gameMaze;

     gameMaze.maze.forEach((wall, i) => {
       this.addGameObject(wall);
     });
  }

  run = function(deltaTime) {

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

      // draw heading direction of Car
      if (item.tag =="Car") {
        drawArrow(pos,p5.Vector.mult(item.headingDirection,20),"red");
      }
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

    // Link all cars to this engine
    if (obj.tag == "Car") {
      obj.setLinkedEngine(this);
    }

  }

  /*
   * Casts rays on the world of objects to determine and return what an object
   * can see. Function does this by:
   * 1) Iterating through rays, starting from the left-most ray and moving right
   * 2) For each ray, find the bodies it collides with using
   *    Matter.Query.ray()
   * 3) For each body, compute the exact location every collision occurs at
   * 4) Then finding the closest collision each ray encounters and returning it
   * Code inspired by Isaiah Smith's "raycast" from
   * https://github.com/Technostalgic/MatterJS_Raycast.git @ 09/May/2021 00:12 ADT
   *
   * @param obj object doing the "seeing" (preferably a car)
   * @return vision array of objects containing vectors (representing rays that
   *         hit an object) and name of object ray collided with
   */
  getVision = function(obj) {
    let n = obj.VISION_RAYS;
    let fov = obj.FIELD_OF_VISION;
    let distance = obj.RENDER_DISTANCE;

    let raySource = Matter.Vector.create(obj.position.x, obj.position.y); //From center of obj
    let leftmostRayAngle = Math.atan2(obj.headingDirection.x, -obj.headingDirection.y) - (fov / 2);
    let currRay = Matter.Vector.create(distance * Math.sin(leftmostRayAngle), -distance * Math.cos(leftmostRayAngle));
    let raySeparationAngle = fov / (n-1);
    let vision = [];
    let ERROR = Math.pow(10, -8);
    for (let i = 0; i < n; i++) {
      let rayEnd = Matter.Vector.add(raySource, currRay);

      //Locate collision point
      let lineCols = [];
      let allCollisions = Matter.Query.ray(Matter.Composite.allBodies(this.physicsEngine.world), raySource, rayEnd);
      allCollisions.forEach(obstacle => {
        if (obstacle.body != obj.body)
        {
          //Compute where vision ray intersects every obstacle's boundary
          let corners = obstacle.body.vertices;
          corners.forEach((corner, i) => {
            let nextCorner = corners[(i + 1) % corners.length];

            let Ray = {
              x1: raySource.x,
              y1: raySource.y,
              x2: rayEnd.x,
              y2: rayEnd.y,
              slope: null, //slope intercept form
              const: null
            }
            let Line = {
              x1: corner.x,
              y1: corner.y,
              x2: nextCorner.x,
              y2: nextCorner.y,
              slope: null,
              const: null
            }

            //Slope intercept form (if not vertical)
            if (Math.abs(Ray.x1 - Ray.x2) > ERROR) {
              Ray.slope = (Ray.y2 - Ray.y1) / (Ray.x2 - Ray.x1);
              Ray.const = Ray.y1 - (Ray.slope * Ray.x1);
            }
            if (Math.abs(Line.x1 - Line.x2) > ERROR) {
              Line.slope = (Line.y2 - Line.y1) / (Line.x2 - Line.x1);
              Line.const = Line.y1 - (Line.slope * Line.x1);
            }

            //Locate intersection
            if ((Ray.slope != Line.slope) ||     // -> If both slopes not same/null
                (Math.abs(Ray.slope - Line.slope) > ERROR))
            {
              let xCol, yCol;
              if (Ray.slope == null) { //Case1 - Ray is vertical
                xCol = Ray.x1;
                yCol = (Line.slope * xCol) + Line.const;
              } else if (Line.slope == null) { //Case2 - Line is vertical
                xCol = Line.x1;
                yCol = (Ray.slope * xCol) + Ray.const;
              } else { //Case3 - Neither is vertical
                xCol = (Ray.const - Line.const) / (Line.slope - Ray.slope);
                yCol = (Ray.slope * xCol) + Ray.const;
              }

              //Check to make sure intersection happened within lines
              let xContained = (((xCol <= Ray.x1) && (xCol >= Ray.x2)) ||
                                ((xCol >= Ray.x1) && (xCol <= Ray.x2))) &&
                               (((xCol <= Line.x1) && (xCol >= Line.x2)) ||
                                ((xCol >= Line.x1) && (xCol <= Line.x2)));
              let yContained = (((yCol <= Ray.y1) && (yCol >= Ray.y2)) ||
                                ((yCol >= Ray.y1) && (yCol <= Ray.y2))) &&
                               (((yCol <= Line.y1) && (yCol >= Line.y2)) ||
                                ((yCol >= Line.y1) && (yCol <= Line.y2)));
              if (xContained && yContained) {
                lineCols.push({
                  x: xCol,
                  y: yCol,
                  obstacle: obstacle.body.label
                });
              }
            }

          });

        }
      });
      //Find closest intersection
      if (lineCols.length > 0) {
        let closestCol = {
          pos: Matter.Vector.sub(lineCols[0], obj.position),
          obstacle: lineCols[0].obstacle
        }
        let closestColDistanceSq = Math.pow(closestCol.pos.x, 2) + Math.pow(closestCol.pos.y, 2);
        lineCols.forEach(collision => {
          let currCol = {
            pos: Matter.Vector.sub(collision, obj.position),
            obstacle: collision.obstacle
          }
          let currColDistanceSq = Math.pow(currCol.pos.x, 2) + Math.pow(currCol.pos.y, 2);
          if ((currColDistanceSq + ERROR) < closestColDistanceSq) {
            closestCol = currCol;
            closestColDistanceSq = currColDistanceSq;
          }
        });
        vision.push({
          x: closestCol.pos.x,
          y: closestCol.pos.y,
          obstacle: closestCol.obstacle
        });
      }

      currRay = Matter.Vector.rotate(currRay, raySeparationAngle); //next ray
    }
    return vision;
  }
}
