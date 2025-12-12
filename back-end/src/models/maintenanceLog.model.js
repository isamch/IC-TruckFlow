import mongoose from "mongoose";


const maintenanceLogSchema = new mongoose.Schema({
  truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck', required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },

  type: {
    type: String,
    enum: ['oil', 'tires', 'engine', 'general'],
    required: true
  },

  description: String,
  cost: Number,
  date: { type: Date, default: Date.now }


}, { timestamps: true });


export default mongoose.model("MaintenanceLog", maintenanceLogSchema);
