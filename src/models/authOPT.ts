import mongoose, { model, Schema } from "mongoose";

const otpSchema = new Schema(
  {
   userId:{
       type:mongoose.Types.ObjectId,
       require:true   
    
    }, 

    otp: {
        type: String,
        // unique: true,
    },
    token: {
      type: String,
      // unique: true,
  },
  signedUp:{
    type: Number,
  }

    // isVerify:{
    //     type:Boolean,
    //     require:true
    // },

  
  },
  { versionKey: false,timestamps:true }
);

const otpModel = model("otpVerify", otpSchema);
export { otpSchema };
export default otpModel;
