const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  primaryDestination: { type: String },
  description: String,
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['planning', 'upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'planning'
  },
  stops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stop" }],
  budgets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Budget" }],
  coverImage: String,
  isPublic: { type: Boolean, default: false },
  shareId: { type: String, unique: true, sparse: true }, // For sharing trips
  totalBudget: { type: Number, default: 0 }
}, { timestamps: true });

// Virtual to calculate trip status based on dates
tripSchema.virtual('calculatedStatus').get(function() {
  if (!this.startDate || !this.endDate) return 'planning';
  
  const now = new Date();
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  
  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'ongoing';
  if (now > end) return 'completed';
  return 'planning';
});

// Pre-save middleware to update status based on dates
tripSchema.pre('save', function(next) {
  if (this.startDate && this.endDate && this.status === 'planning') {
    this.status = this.calculatedStatus;
  }
  next();
});

module.exports = mongoose.model("Trip", tripSchema);
