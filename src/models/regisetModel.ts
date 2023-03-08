import mongoose, { model, Schema } from "mongoose";

const registerSchema = new Schema({

  firstName:String,
    email:String,
    password:String,
    isVerify:{
      type:Boolean,
      default:false

    }


},{versionKey:false,timestamps:true})


const regisetModel = model('register',registerSchema)
export {registerSchema}
export default regisetModel