import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import router from "./routes/authRoutes.js";
import cookies from "cookie-parser";
import cors from "cors";

const app = express();
app.use(cookies());




app.use(express.json());

app.use(cors({
    origin:"http://localhost:3001",
    credentials:true
}))

app.get("/", (req,res)=>{
    res.send("Hello World");
})

app.use("/api/auth", router);

connectDB();


app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})