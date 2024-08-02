const redis = require("redis");

const redisClient = redis.createClient();

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
    process.exit(1); // Exit the process if Redis connection fails
  }
}

module.exports = {
  redisClient,
  connectRedis,
};
