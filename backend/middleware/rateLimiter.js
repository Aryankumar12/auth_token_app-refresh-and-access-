import redisClient from "../config/redis.js";
const loginRateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const key = `login_attempts:${ip}`;

    const attempts = await redisClient.get(key);

    if (attempts && parseInt(attempts) >= 5) {
      return res.status(429).json({
        message: "Too many login attempts. Try again later."
      });
    }

    next();

  } catch (err) {
    console.error("Rate limiter error:", err);
    next();
  }
};

export default loginRateLimiter;