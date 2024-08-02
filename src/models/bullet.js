const { Bodies, Composite, Body } = require("matter-js");
const {
  BULLET_SPEED,
  BULLET_MAX_DISTANCE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BULLET_CATEGORY,
  PAWN_CATEGORY,
  WALL_CATEGORY,
} = require("../config/gameConstants");

function createBullet(clientData, world) {
  const directionX = clientData.pawn.direction.directionX;
  const directionY = clientData.pawn.direction.directionY;

  const x = clientData.pawn.body.position.x;
  const y = clientData.pawn.body.position.y;
  const bulletRadius = clientData.pawn.bulletConfig.bulletRadius;

  // Offset the bullet's initial position slightly
  const magnitude = Math.sqrt(directionX ** 2 + directionY ** 2);
  const offsetX = (directionX / magnitude) * (bulletRadius + 20);
  const offsetY = (directionY / magnitude) * (bulletRadius + 20);

  const bulletWidth = clientData.pawn.bulletConfig.bulletWidth;
  const bulletHeight = clientData.pawn.bulletConfig.bulletHeight;

  // Calculate the angle of rotation
  const angle = Math.atan2(directionY, directionX);

  const bulletBody = Bodies.rectangle(
    x + offsetX,
    y + offsetY,
    bulletWidth,
    bulletHeight,
    {
      label: "Bullet",
      clientId: clientData.clientId,
      isStatic: false,
      restitution: 0,
      friction: 0,
      frictionAir: 0,
      angle,
      collisionFilter: {
        category: BULLET_CATEGORY,
        mask: PAWN_CATEGORY,
      },
    }
  );

  // const bulletBody = Bodies.circle(x + offsetX, y + offsetY, bulletRadius, {
  //   label: "Bullet",
  //   isStatic: false,
  //   restitution: 0,
  //   friction: 0,
  //   frictionAir: 0,
  // });

  // Calculate initial velocity based on direction
  const velocityX = (directionX / magnitude) * BULLET_SPEED;
  const velocityY = (directionY / magnitude) * BULLET_SPEED;

  // Set the initial velocity of the bullet
  Body.setVelocity(bulletBody, { x: velocityX, y: velocityY });

  // Add the bullet to the world
  Composite.add(world, bulletBody);

  return {
    body: bulletBody,
    clientId: clientData.clientId,
    bulletRadius,
    bulletWidth,
    bulletHeight,
    distanceTravelled: 0,
    update(bullets, index) {
      // Calculate distance travelled
      this.distanceTravelled += BULLET_SPEED;

      // Check if the bullet should be removed
      const { x, y } = this.body.position;
      if (
        this.distanceTravelled >= BULLET_MAX_DISTANCE ||
        x < 0 ||
        x > CANVAS_WIDTH ||
        y < 0 ||
        y > CANVAS_HEIGHT
      ) {
        // Remove the bullet from the world
        Composite.remove(world, this.body);
        // Remove the bullet from the array
        bullets.splice(index, 1);
      }
    },
  };
}

module.exports = createBullet;
