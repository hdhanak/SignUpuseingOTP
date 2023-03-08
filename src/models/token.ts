import mongoose, { model, Schema } from "mongoose";


const tokenSchema = new Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        required: true
    },
    token:{
        type:String,
        required:true
    },
    
    
  
},{versionKey:false})

const tokenModel = model('token',tokenSchema)
export default tokenModel