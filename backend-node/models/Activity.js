const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  stop: { type: mongoose.Schema.Types.ObjectId, ref: "Stop", required: true },
  name: { type: String, required: true },
  description: String,
  category: {
    type: String,
    enum: ['Sightseeing', 'Food', 'Culture', 'Adventure', 'Shopping', 'Nightlife', 'Transportation', 'Accommodation', 'Other'],
    default: 'Other'
  },
  startTime: Date,
  endTime: Date,
  cost: { type: Number, default: 0 }, 
}, { timestamps: true });

module.exports = mongoose.model("Activity", activitySchema);
