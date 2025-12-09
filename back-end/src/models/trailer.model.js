import mongoose from "mongoose";


const trailerSchema = new mongoose.Schema({
  serialNumber: { type: String, required: true, unique: true },
  type: String,
  maxLoadKg: Number,
  status: {
    type: String,
    enum: ['available', 'on_trip', 'maintenance'],
    default: 'available'
  },
  lastCheckDate: Date


}, { timestamps: true });


export default mongoose.model("trailer", trailerSchema);
