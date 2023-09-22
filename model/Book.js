import mongoose, {Schema} from "mongoose";

const bookSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    cover:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    }
},{timestamps:true})

export default mongoose.model("Book",bookSchema)