import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import redisClient from "../config/redis.js";




const generateAccessToken = (user)=>{
    return jwt.sign({id:user._id , role: user.roles}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
}

const generateRefreshToken = (user)=>{
    return jwt.sign({id:user._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn:"7d"});
}


const register = async(req, res)=>{
    const {name, email, password} = req.body;
    
    
    if(!name || !email || !password){
        return res.status(400).json({"message": "Please fill all the fields"});
    }
    const userExist = await User.findOne({email});

    if(userExist){
        return res.status(400).json({"message": "user already exists"});


        
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name,
        email,
        password:hashedPassword
    })

    res.status(200).json({"message": "user registered successfully"});
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const ip = req.headers["x-forwarded-for"] || req.ip;
  const key = `login_attempts:${ip}`;

  const user = await User.findOne({ email });

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  if (!user) {

    await redisClient.incr(key);
    await redisClient.expire(key, 900);
    return res.status(400).json({ message: "User not registered" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    await redisClient.incr(key);
    await redisClient.expire(key, 900);
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // ✅ Successful login → reset counter
  await redisClient.del(key);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ accessToken });
};

export { register, loginUser };