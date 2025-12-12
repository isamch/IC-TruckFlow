import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  role: { type: String, enum: ['admin', 'driver'], required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },

  // for driver
  licenseNumber: { type: String },
  cin: { type: String },
  phone: { type: String },

  isActive: { type: Boolean, default: true },


}, { timestamps: true });


export default mongoose.model("User", UserSchema);
