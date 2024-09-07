const gameState = require("../services/gameState");
const { Composite } = require("matter-js");

function handleClientDisconnection(ws, world) {
  if (gameState.clients.has(ws.clientId)) {
    gameState.clients.delete(ws.clientId);
  }

  if (gameState.entities.has(ws.clientId)) {
    Composite.remove(world, gameState.entities.get(ws.clientId).entityBody);

    gameState.entities.delete(ws.clientId);

    for (const [bulletId, bullet] of gameState.bullets) {
      if (bullet.entity_id === ws.clientId) {
        const removedBullet = gameState.bullets.get(bulletId);
        Composite.remove(world, removedBullet.bulletBody);
        gameState.bullets.delete(bulletId);
        gameState.removedBullets.set(removedBullet.bullet_id, removedBullet);
      }
    }
  }

  console.log(`Client ${ws.clientId} disconnected`);
}

module.exports = { handleClientDisconnection };
