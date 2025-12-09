import mongoose from "mongoose";


const truckSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true },
  brand: String,
  model: String,

  currentKm: { type: Number, required: true, default: 0 },
  fuelCapacity: Number,
  status: {
    type: String,
    enum: ['available', 'on_trip', 'maintenance'],
    default: 'available'
  },

  lastOilChangeKm: Number,
  lastGeneralCheckDate: Date,

  tires: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tire' }],



}, { timestamps: true });


export default mongoose.model("truck", truckSchema);
