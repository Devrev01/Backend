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
    price:{
        type:Number,
        default:0
    },
    cover:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
        default:"Knowledge"
    },
    quantity:{
        type:Number,
        required:true,
        default:1
    },
    bookId:{
        type:String,
        required:true
    }
},{timestamps:true})

export default mongoose.model("Book",bookSchema)