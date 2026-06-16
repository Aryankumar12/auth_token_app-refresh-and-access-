import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    name:String,
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
    roles:{
        type:String,
         enum: ["user", "admin"],
         default:"user"

    }


}, {Timestamp:true});


const User =  mongoose.model("User", userSchema);

export default User;