import mongoose from "mongoose";


const fuelLogSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  liters: { type: Number, required: true },
  pricePerLiter: Number,
  totalCost: Number,
  stationName: String,
  timestamp: { type: Date, default: Date.now }


}, { timestamps: true });


export default mongoose.model("FuelLog", fuelLogSchema);
