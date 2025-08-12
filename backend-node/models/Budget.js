const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  type: { 
    type: String, 
    enum: ["Accommodation", "Transportation", "Food & Dining", "Activities", "Shopping", "Other"], 
    required: true 
  },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: String,
  activity: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" }, // optional link
  
  // Keep old fields for backward compatibility
  category: { type: String, enum: ["transport", "accommodation", "food", "activity", "other"] },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model("Budget", budgetSchema);
