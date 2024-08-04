const redis = require("redis");

const publisher = redis.createClient();
const subscriber = redis.createClient();

publisher.on("error", (err) => console.error("Redis publisher error:", err));
subscriber.on("error", (err) => console.error("Redis subscriber error:", err));

async function connectRedis() {
  try {
    await publisher.connect();
    await subscriber.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
    process.exit(1); // Exit the process if Redis connection fails
  }
}

module.exports = {
  publisher,
  subscriber,
  connectRedis,
};
