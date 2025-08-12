const Stop = require("../models/Stop");
const Activity = require("../models/Activity");
const Trip = require("../models/Trip");

exports.getStops = async (req, res) => {
  try {
    // Get user's trips first
    const userTrips = await Trip.find({ user: req.user._id }).select('_id');
    const tripIds = userTrips.map(trip => trip._id);

    const stops = await Stop.find({ trip: { $in: tripIds } })
      .populate("trip", "name primaryDestination")
      .populate("city", "name country")
      .populate("activities")
      .sort({ arrivalDate: 1 });

    res.json(stops);
  } catch (err) {
    console.error("Error fetching stops:", err);
    res.status(500).json({ message: "Server error fetching stops" });
  }
};

exports.getStopById = async (req, res) => {
  try {
    // Get user's trips first
    const userTrips = await Trip.find({ user: req.user._id }).select('_id');
    const tripIds = userTrips.map(trip => trip._id);

    const stop = await Stop.findOne({ 
      _id: req.params.id, 
      trip: { $in: tripIds } 
    })
      .populate("trip", "name primaryDestination")
      .populate("city", "name country")
      .populate("activities");

    if (!stop) return res.status(404).json({ message: "Stop not found" });

    res.json(stop);
  } catch (err) {
    console.error("Error fetching stop:", err);
    res.status(500).json({ message: "Server error fetching stop" });
  }
};

exports.createStop = async (req, res) => {
  try {
    const { trip, city, arrivalDate, departureDate, activities } = req.body;

    // Verify that the trip belongs to the current user
    const tripDoc = await Trip.findOne({ _id: trip, user: req.user._id });
    if (!tripDoc) {
      return res.status(404).json({ message: "Trip not found or access denied" });
    }

    const stop = await Stop.create({
      trip,
      city,
      arrivalDate,
      departureDate,
      activities: activities || []
    });

    // Add stop to trip's stops array
    await Trip.findByIdAndUpdate(trip, {
      $push: { stops: stop._id }
    });

    const populatedStop = await Stop.findById(stop._id)
      .populate("trip", "name")
      .populate("city", "name country")
      .populate("activities");

    // Transform data to match frontend expectations
    const transformedStop = {
      ...populatedStop.toObject(),
      id: populatedStop._id,
      cityName: populatedStop.city?.name || 'Unknown City',
      country: populatedStop.city?.country || 'Unknown Country',
      startDate: populatedStop.arrivalDate,
      endDate: populatedStop.departureDate,
      activities: populatedStop.activities?.map(activity => ({
        ...activity.toObject(),
        id: activity._id,
        date: activity.startTime,
        duration: activity.endTime && activity.startTime ? 
          Math.round((new Date(activity.endTime) - new Date(activity.startTime)) / (1000 * 60 * 60) * 10) / 10 : null,
        category: activity.category || 'Other'
      })) || []
    };

    res.status(201).json(transformedStop);
  } catch (err) {
    console.error("Error creating stop:", err);
    res.status(500).json({ message: "Server error creating stop" });
  }
};

exports.updateStop = async (req, res) => {
  try {
    const { trip, city, arrivalDate, departureDate, activities } = req.body;

    const stop = await Stop.findByIdAndUpdate(
      req.params.id,
      { trip, city, arrivalDate, departureDate, activities },
      { new: true }
    )
      .populate("trip", "name")
      .populate("city", "name country")
      .populate("activities");

    if (!stop) return res.status(404).json({ message: "Stop not found" });

    res.json(stop);
  } catch (err) {
    console.error("Error updating stop:", err);
    res.status(500).json({ message: "Server error updating stop" });
  }
};

exports.deleteStop = async (req, res) => {
  try {
    const stop = await Stop.findByIdAndDelete(req.params.id);

    if (!stop) return res.status(404).json({ message: "Stop not found" });

    // Also delete associated activities
    await Activity.deleteMany({ stop: req.params.id });

    res.json({ message: "Stop deleted successfully" });
  } catch (err) {
    console.error("Error deleting stop:", err);
    res.status(500).json({ message: "Server error deleting stop" });
  }
};
