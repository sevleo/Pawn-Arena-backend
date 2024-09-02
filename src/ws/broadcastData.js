const { BROADCAST_RATE_INTERVAL } = require("../config/gameConstants");
const {
  entities,
  bullets,
  last_processed_input,
} = require("../services/gameState");

// Loop to broadcast the game state
function setBroadcastWorldStateInterval(wss) {
  return setInterval(() => {
    broadcastWorldState(wss);
  }, BROADCAST_RATE_INTERVAL);
}

function broadcastWorldState(wss) {
  // Send the world state to all the connected clients.
  let world_entities = entities.map((entity) => {
    return {
      entity_id: entity.clientId,
      position: {
        // x: entity.entityBody.position.x,
        // y: entity.entityBody.position.y,
        x: entity.position.x,
        y: entity.position.y,
      },
      faceDirection: entity.faceDirection,
      last_processed_input: last_processed_input[entity.clientId] || null,
    };
  });
  let world_bullets = bullets.map((bullet) => {
    return {
      bullet_id: bullet.bullet_id,
      entity_id: bullet.entity_id,
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
    };
  });
  let world_state = {
    entities: world_entities,
    bullets: world_bullets,
  };

  const worldStateMessage = JSON.stringify({
    type: "world_state",
    data: world_state,
    ts: Date.now(),
  });

  wss.clients.forEach((client) => {
    client.send(worldStateMessage);
  });
}

module.exports = { setBroadcastWorldStateInterval };
