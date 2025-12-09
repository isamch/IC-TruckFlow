import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  // add your fields here


}, { timestamps: true });


export default mongoose.model("user", userSchema);
