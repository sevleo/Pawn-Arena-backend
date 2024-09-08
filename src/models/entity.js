const {
  MOVEMENT_SPEED,
  BULLET_COOLDOWN,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  RADIUS,
} = require("../config/gameConstants");
const { Bodies, Composite, Body } = require("matter-js");
const Bullet = require("./bullet");
const {
  bullets,
  getNewBulletId,
  entities,
  getNewEntityId,
} = require("../services/gameState");

class Entity {
  constructor(clientId, world) {
    this.world = world;
    this.entityId = getNewEntityId();
    this.clientId = clientId;
    this.position = generateRandomPosition();
    this.faceDirection = {
      x: 0,
      y: 0,
    };
    this.speed = MOVEMENT_SPEED;
    this.lastBulletTimestamp = null;
    this.health = 5;

    this.entityBody = Bodies.circle(this.position.x, this.position.y, 10, {
      label: "entity",
      clientId: clientId,
      isStatic: false,
      restitution: 0,
      friction: 0.5,
      frictionAir: 0.5,
    });

    Composite.add(world, this.entityBody);
  }

  applyInput(input, world, bullet_sequence_number) {
    // Update position
    let xChange = 0;
    let yChange = 0;
    if (input.active_keys.right) xChange = this.speed * input.press_time;
    if (input.active_keys.left) xChange = -this.speed * input.press_time;
    if (input.active_keys.up) yChange = -this.speed * input.press_time;
    if (input.active_keys.down) yChange = this.speed * input.press_time;

    if (xChange !== 0 || yChange !== 0) {
      const diagonalFactor = 0.7071; // Approximation of 1/√2 for 45-degree movement
      if (xChange !== 0 && yChange !== 0) {
        xChange *= diagonalFactor;
        yChange *= diagonalFactor;
      }

      // Calculate the new position before applying it
      const newX = this.position.x + xChange;
      const newY = this.position.y + yChange;

      // Boundary checks to ensure entity stays within canvas width and height
      const clampedX = Math.max(RADIUS, Math.min(newX, CANVAS_WIDTH - RADIUS));
      const clampedY = Math.max(RADIUS, Math.min(newY, CANVAS_HEIGHT - RADIUS));

      // Update the position of the entity based on the clamped values
      this.position.x = clampedX;
      this.position.y = clampedY;

      Body.setPosition(this.entityBody, {
        x: this.position.x,
        y: this.position.y,
      });
    }

    this.mousePosition = { x: input.mousePosition.x, y: input.mousePosition.y };

    // Update direction
    this.faceDirection.x = input.faceDirection.x;
    this.faceDirection.y = input.faceDirection.y;

    // Create bullet
    if (input.active_keys.space) {
      const currentTimestamp = Date.now();

      if (
        this.lastBulletTimestamp === null || // No bullets have been fired yet
        currentTimestamp - this.lastBulletTimestamp >= BULLET_COOLDOWN // 200ms cooldown
      ) {
        const newBulletId = getNewBulletId();
        const bullet = new Bullet(
          this.clientId,
          this.position,
          this.faceDirection,
          newBulletId,
          // bullets.length,
          this.mousePosition,
          world,
          bullet_sequence_number
        );

        console.log(bullet);

        // bullets.push(bullet);
        bullets.set(bullet.bullet_id, bullet);
        this.lastBulletTimestamp = currentTimestamp; // Update the last bullet timestamp
      }
    }
  }
}

function createEntity(ws, world) {
  const entity = new Entity(ws.clientId, world);
  entities.set(entity.clientId, entity);
  ws.send(JSON.stringify({ type: "newEntityId", entityId: entity.entityId }));
}

function generateRandomPosition() {
  // Generate random x and y positions, ensuring the pawn stays within canvas bounds
  const x = Math.random() * (CANVAS_WIDTH - RADIUS);
  const y = Math.random() * (CANVAS_HEIGHT - RADIUS);
  return { x, y };
}

module.exports = { createEntity };
