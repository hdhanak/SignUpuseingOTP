import mongoose, { model, Schema } from "mongoose";

const gioSchema = new Schema(
  {
    name:String,
    location: {
        type:{
            type: String,
            enum:["Polygon","Point"],
          
        },
        coordinates: {
            type:[Number],// Array of arrays of arrays of numbers
        },
//         $near: {
//             $geometry: {
//                type: "Point" ,
//                coordinates:[-73.856077, 40.848447]
//             },
//             $maxDistance:5,
//             $minDistance:6,
  },
  
  },
  { versionKey: false,timestamps:true }
);
gioSchema.index({location:"2dsphere"})
const gioModel = model("otpLoc", gioSchema);
export { gioSchema };
export default gioModel;
