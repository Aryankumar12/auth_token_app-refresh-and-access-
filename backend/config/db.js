import mongoose from "mongoose";


console.log(process.env.mongodbUri)
const connectDB = async () =>{

    try{    

        await mongoose.connect(process.env.mongodbUri);
        console.log("database connected");

    }
    catch(err){

        console.log("Error connecting database pls try again later");
        console.log(err);

    }


}


export default connectDB;