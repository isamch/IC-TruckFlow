import mongoose from "mongoose";


const tripSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck', required: true },
  trailer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trailer' },

  startLocation: String,
  endLocation: String,
  plannedDate: { type: Date, required: true },

  status: {
    type: String,
    enum: ['to_do', 'in_progress', 'finished'],
    default: 'to_do'
  },

  startKm: Number,
  endKm: Number,

  totalDistance: Number,

  fuelUsed: Number,
  notes: String,

  pdfPath: String,

  fuelLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FuelLog' }],
  maintenanceLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MaintenanceLog' }]

}, { timestamps: true });


export default mongoose.model("trip", tripSchema);
