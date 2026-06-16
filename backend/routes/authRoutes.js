import express from "express";
import jwt from "jsonwebtoken";
import { register, loginUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import redisClient from "../config/redis.js";
import loginRateLimiter from "../middleware/rateLimiter.js";


const router = express.Router();


router.post("/register", register);

router.post("/login", loginRateLimiter, loginUser);


router.get("/me", protect, (req, res)=>{
    res.json({
        id:req.user_id,
        message: "Protected route accessed successfully"
    })
})


router.post("/refresh", (req, res) => {
  console.log("Refresh route hit");
  console.log("Cookies:", req.cookies);

  const token = req.cookies.refreshToken;

  if (!token) {
    console.log("No refresh token found");
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    console.log("Refresh token valid");

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({ accessToken: newAccessToken });

  } catch (err) {
    console.log("Refresh token invalid");
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});


router.get("/users", protect, async(req, res)=>{
    try{
        const cachedUsers = await redisClient.get("users");

        if(cachedUsers){
            console.log("Users fetched from cache");
            return res.json(JSON.parse(cachedUsers));
        }

        const users = await User.find().select("-password");
         await redisClient.setEx("users", 2, JSON.stringify(users));
        console.log("Users fetched from database");
        res.json(users);
    }
    catch(err){
        res.status(500).json({message: "Server error"});    
    }


})

router.post("/logout", (req,res)=>{
    res.clearCookie("refreshToken");
    res.json({message: "Logged out successfully"});
})




router.delete("/users/:id", protect, async(req, res)=>{
    try{

       await redisClient.del("users");
        const uuser = await User.findById(req.user.id);
        console.log("User roles:", uuser.roles, "Type:", typeof uuser.roles);
        if(!uuser || uuser.roles !== "admin"){
            return res.status(403).json({message: "Access denied"});
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        
    
        res.json({message: "User deleted successfully"});
    }
    catch(err){
        res.status(500).json({message: "Server error"});
    }
    
})
export default router;