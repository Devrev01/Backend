import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    cart:[{type:Schema.Types.ObjectId,ref:"Book"}],
},{timestamps:true})

export default mongoose.model("User",userSchema)