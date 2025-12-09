import mongoose from "mongoose";


const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date, default: Date.now,
    expires: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  }

}, { timestamps: true });


export default mongoose.model("token", tokenSchema);
