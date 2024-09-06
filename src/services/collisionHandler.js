const { Events, Composite } = require("matter-js");
const { bullets, removedBullets } = require("./gameState");

function handleCollisions(engine, world) {
  try {
    Events.on(engine, "collisionStart", function (event) {
      for (const pair of event.pairs) {
        if (
          pair.bodyA.label === "entity" &&
          pair.bodyB.label === "bullet" &&
          pair.bodyA.clientId !== pair.bodyB.clientId
        ) {
          let removedBullet;
          if (bullets.has(pair.bodyB.bulletId)) {
            removedBullet = bullets.get(pair.bodyB.bulletId);
            Composite.remove(world, removedBullet.bulletBody);
            bullets.delete(pair.bodyB.bulletId);
            // removedBullets.push(removedBullet);
            removedBullets.set(removedBullet.bullet_id, removedBullet);
            console.log(
              `Bullet of entity ${pair.bodyB.clientId} has hit entity ${pair.bodyA.clientId}`
            );
          }
        }

        if (
          pair.bodyA.label === "bullet" &&
          pair.bodyB.label === "entity" &&
          pair.bodyA.clientId !== pair.bodyB.clientId
        ) {
          console.log(bullets);

          let removedBullet;
          if (bullets.has(pair.bodyA.bulletId)) {
            removedBullet = bullets.get(pair.bodyA.bulletId);
            Composite.remove(world, removedBullet.bulletBody);
            bullets.delete(pair.bodyA.bulletId);
            // removedBullets.push(removedBullet);
            removedBullets.set(removedBullet.bullet_id, removedBullet);
            console.log(
              `Bullet of entity ${pair.bodyA.clientId} has hit entity ${pair.bodyB.clientId}`
            );
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
