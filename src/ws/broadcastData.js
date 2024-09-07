const { BROADCAST_RATE_INTERVAL } = require("../config/gameConstants");
const {
  entities,
  bullets,
  last_processed_input,
  deadEntities,
} = require("../services/gameState");
let { removedBullets } = require("../services/gameState");

// Loop to broadcast the game state
function setBroadcastWorldStateInterval(wss) {
  return setInterval(() => {
    broadcastWorldState(wss);
  }, BROADCAST_RATE_INTERVAL);
}

function broadcastWorldState(wss) {
  // Send the world state to all the connected clients.
  let world_entities = Array.from(entities.values()).map((entity) => {
    return {
      clientId: entity.clientId,
      position: {
        x: entity.position.x,
        y: entity.position.y,
      },
      faceDirection: entity.faceDirection,
      last_processed_input: last_processed_input[entity.clientId] || null,
    };
  });
  let world_bullets = Array.from(bullets.values()).map((bullet) => {
    // Store the current value of newBullet
    const isNewBullet = bullet.newBullet;

    // Update the bullet's newBullet property to false
    bullet.newBullet = false;

    // Return the bullet object with the original value of newBullet
    return {
      bullet_id: bullet.bullet_id,
      clientId: bullet.clientId,
      initialPosition: {
        x: bullet.initialPosition.x,
        y: bullet.initialPosition.y,
      },
      serverPosition: {
        x: bullet.serverPosition.x,
        y: bullet.serverPosition.y,
      },
      direction: {
        x: bullet.direction.x,
        y: bullet.direction.y,
      },
      mousePosition: bullet.mousePosition,
      newBullet: isNewBullet, // Use the stored value.
      bullet_sequence_number: bullet.bullet_sequence_number,
    };
  });

  let removed_bullets = Array.from(removedBullets.values()).map((bullet) => {
    return {
      bullet_id: bullet.bullet_id,
      bullet_sequence_number: bullet.bullet_sequence_number,
    };
  });

  let dead_entities = Array.from(deadEntities.values()).map((entity) => {
    // console.log(entity);
    // console.log(deadEntities);
    return {
      clientId: entity.clientId,
    };
  });

  let world_state = {
    entities: world_entities,
    bullets: world_bullets,
    removedBullets: removed_bullets,
    deadEntities: dead_entities,
  };

  // console.log(world_state);

  const worldStateMessage = JSON.stringify({
    type: "world_state",
    data: world_state,
    ts: Date.now(),
  });

  wss.clients.forEach((client) => {
    client.send(worldStateMessage);
  });
  removedBullets.clear();
}

module.exports = { setBroadcastWorldStateInterval };
