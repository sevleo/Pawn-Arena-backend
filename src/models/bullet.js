function createBullet(clientData) {
  //   const position = createPosition(x, y, radius);
  return {
    x: clientData.pawn.position.x,
    y: clientData.pawn.position.y,
    directionX: clientData.direction.directionX,
    directionY: clientData.direction.directionY,
    distanceTravelled: 0,
  };
}

module.exports = createBullet;
