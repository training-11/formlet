import { createClient } from "redis";

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || "formlet-redis",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});

await redisClient.connect();

export default redisClient;

