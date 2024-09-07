const { Events, Composite } = require("matter-js");
const {
  bullets,
  removedBullets,
  entities,
  deadEntities,
} = require("./gameState");

function handleCollisions(engine, world) {
  try {
    Events.on(engine, "collisionStart", function (event) {
      for (const pair of event.pairs) {
        let entity;
        let bullet;
        if (pair.bodyA.label === "entity" && pair.bodyB.label === "bullet") {
          entity = pair.bodyA;
          bullet = pair.bodyB;
        } else if (
          pair.bodyA.label === "bullet" &&
          pair.bodyB.label === "entity"
        ) {
          entity = pair.bodyB;
          bullet = pair.bodyA;
        }
        if (entity && bullet && entity.clientId !== bullet.clientId) {
          if (bullets.has(bullet.bulletId)) {
            const removedBullet = bullets.get(bullet.bulletId);
            Composite.remove(world, removedBullet.bulletBody);
            bullets.delete(bullet.bulletId);
            removedBullets.set(removedBullet.bullet_id, removedBullet);
            entities.get(entity.clientId).health--;
            console.log(entities.get(entity.clientId).health);
            console.log(
              `Bullet of entity ${bullet.clientId} has hit entity ${entity.clientId}`
            );
            if (entities.get(entity.clientId).health <= 0) {
              console.log(`${entity.clientId} is dead.`);
              Composite.remove(world, entities.get(entity.clientId).entityBody);
              deadEntities.set(entity.clientId, entities.get(entity.clientId));
              entities.delete(entity.clientId);
            }
          }
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  handleCollisions,
};
