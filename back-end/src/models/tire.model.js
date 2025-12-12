import mongoose from "mongoose";


const tireSchema = new mongoose.Schema({
  position: { type: String, required: true },
  installKm: { type: Number, required: true },
  currentKm: { type: Number, default: 0 },
  condition: {
    type: String,
    enum: ['good', 'worn', 'critical'],
    default: 'good'
  },
  truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' }

}, { timestamps: true });


export default mongoose.model("Tire", tireSchema);
