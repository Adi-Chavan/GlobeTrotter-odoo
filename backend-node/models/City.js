// models/City.js
const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  description: String,
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, { timestamps: true });

// Create index for efficient searching
citySchema.index({ name: 1, country: 1 });

module.exports = mongoose.model("City", citySchema);
