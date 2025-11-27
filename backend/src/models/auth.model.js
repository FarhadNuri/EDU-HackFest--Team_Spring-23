import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email : {
        type:String,
        required:true,
        unique:true
    },
    password : {
        type:String,
        required:true,
        minlength:6
    },
    fullname: {
        type: String,
        required:true
    },
    mobile: {
        type:String,
        required: true,
        unique:true
    },
    language: {
        type:String,
        enum:["en","ban"],
        default:"en",
    }
},{timestamps: true})


const User = mongoose.model("User",userSchema)

export default User