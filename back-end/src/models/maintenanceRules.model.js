import mongoose from "mongoose";


const maintenanceRulesSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['oil', 'tires', 'engine', 'general'],
    required: true
  },
  everyKm: Number,
  everyMonths: Number

}, { timestamps: true });


export default mongoose.model("maintenanceRules", maintenanceRulesSchema);
