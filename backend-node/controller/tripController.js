const Trip = require("../models/Trip");
const Stop = require("../models/Stop");
const Budget = require("../models/Budget");

exports.createTrip = async (req, res) => {
  try {
    console.log("Creating trip - Request body:", req.body);
    console.log("Creating trip - User ID:", req.user?._id);
    
    const { name, description, destination, startDate, endDate, stops, budgets, coverImage, isPublic } = req.body;

    const trip = await Trip.create({
      user: req.user._id, 
      name,
      description,
      primaryDestination: destination || (stops && stops.length > 0 ? stops[0].destination : null),
      startDate,
      endDate,
      stops: stops || [],   
      budgets: budgets || [],
      coverImage,
      isPublic: isPublic || false
    });

    console.log("Trip created successfully:", trip);
    res.status(201).json(trip);
  } catch (err) {
    console.error("Error creating trip:", err);
    res.status(500).json({ error: "Failed to create trip", details: err.message });
  }
};


exports.getTrips = async (req, res) => {
  try {
    console.log("Fetching trips for user:", req.user._id);
    const trips = await Trip.find({ user: req.user._id })
      .populate("stops")
      .populate("budgets");

    console.log("Found trips:", trips.length);
    res.json(trips);
  } catch (err) {
    console.error("Error fetching trips:", err);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
};

exports.getTripById = async (req, res) => {
  try {
    console.log("Fetching trip by ID:", req.params.id, "for user:", req.user._id);
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id })
      .populate({
        path: 'stops',
        populate: [
          {
            path: 'city',
            select: 'name country'
          },
          {
            path: 'activities',
            select: 'name description startTime endTime cost'
          }
        ]
      })
      .populate("budgets");

    if (!trip) {
      console.log("Trip not found");
      return res.status(404).json({ error: "Trip not found" });
    }
    
    // Transform the data to match frontend expectations
    const transformedTrip = {
      ...trip.toObject(),
      id: trip._id,
      destination: trip.primaryDestination,
      destinations: trip.stops?.map(stop => stop.city?.name).filter(Boolean) || [],
      stops: trip.stops?.map(stop => ({
        ...stop.toObject(),
        id: stop._id,
        cityName: stop.city?.name || 'Unknown City',
        country: stop.city?.country || 'Unknown Country',
        startDate: stop.arrivalDate,
        endDate: stop.departureDate,
        activities: stop.activities?.map(activity => ({
          ...activity.toObject(),
          id: activity._id,
          date: activity.startTime,
          duration: activity.endTime && activity.startTime ? 
            Math.round((new Date(activity.endTime) - new Date(activity.startTime)) / (1000 * 60 * 60) * 10) / 10 : null,
          category: activity.category || 'Other'
        })) || []
      })) || []
    };
    
    console.log("Trip found and transformed successfully:", transformedTrip);
    res.json(transformedTrip);
  } catch (err) {
    console.error("Error fetching trip:", err);
    res.status(500).json({ error: "Failed to fetch trip" });
  }
};


exports.updateTrip = async (req, res) => {
  try {
    const updatedTrip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedTrip) return res.status(404).json({ error: "Trip not found" });
    res.json(updatedTrip);
  } catch (err) {
    console.error("Error updating trip:", err);
    res.status(500).json({ error: "Failed to update trip" });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const deletedTrip = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deletedTrip) return res.status(404).json({ error: "Trip not found" });
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    console.error("Error deleting trip:", err);
    res.status(500).json({ error: "Failed to delete trip" });
  }
};

exports.getPublicTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ isPublic: true })
      .populate("stops")
      .populate("budgets");

    res.json(trips);
  } catch (err) {
    console.error("Error fetching public trips:", err);
    res.status(500).json({ error: "Failed to fetch public trips" });
  }
};

exports.getSharedTrip = async (req, res) => {
  try {
    const { shareId } = req.params;
    console.log("Fetching shared trip with shareId:", shareId);
    
    // Find trip by shareId or regular ID if it's public
    const trip = await Trip.findOne({
      $or: [
        { shareId: shareId },
        { _id: shareId, isPublic: true }
      ]
    })
      .populate({
        path: 'stops',
        populate: [
          {
            path: 'city',
            select: 'name country'
          },
          {
            path: 'activities',
            select: 'name description startTime endTime cost category'
          }
        ]
      })
      .populate("budgets")
      .populate("user", "name email");

    if (!trip) {
      return res.status(404).json({ error: "Shared trip not found or not available for sharing" });
    }

    // Transform the data for frontend
    const transformedTrip = {
      ...trip.toObject(),
      id: trip._id,
      destination: trip.primaryDestination,
      destinations: trip.stops?.map(stop => stop.city?.name).filter(Boolean) || [],
      stops: trip.stops?.map(stop => ({
        ...stop.toObject(),
        id: stop._id,
        cityName: stop.city?.name || 'Unknown City',
        country: stop.city?.country || 'Unknown Country',
        startDate: stop.arrivalDate,
        endDate: stop.departureDate,
        activities: stop.activities?.map(activity => ({
          ...activity.toObject(),
          id: activity._id,
          date: activity.startTime,
          duration: activity.endTime && activity.startTime ? 
            Math.round((new Date(activity.endTime) - new Date(activity.startTime)) / (1000 * 60 * 60) * 10) / 10 : null,
          category: activity.category || 'Other'
        })) || []
      })) || []
    };

    res.json(transformedTrip);
  } catch (err) {
    console.error("Error fetching shared trip:", err);
    res.status(500).json({ error: "Failed to fetch shared trip" });
  }
};

exports.generateShareLink = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Generating share link for trip:", id);

    const trip = await Trip.findOne({ _id: id, user: req.user._id });
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // Generate a unique share ID if it doesn't exist
    if (!trip.shareId) {
      const crypto = require('crypto');
      trip.shareId = crypto.randomBytes(16).toString('hex');
      await trip.save();
    }

    const shareUrl = `${req.protocol}://${req.get('host')}/shared/${trip.shareId}`;
    
    res.json({ 
      shareId: trip.shareId,
      shareUrl: shareUrl,
      message: "Share link generated successfully"
    });
  } catch (err) {
    console.error("Error generating share link:", err);
    res.status(500).json({ error: "Failed to generate share link" });
  }
};

exports.toggleTripVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublic } = req.body;

    const trip = await Trip.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { isPublic: isPublic },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.json({ 
      message: `Trip ${isPublic ? 'made public' : 'made private'} successfully`,
      isPublic: trip.isPublic
    });
  } catch (err) {
    console.error("Error toggling trip visibility:", err);
    res.status(500).json({ error: "Failed to update trip visibility" });
  }
};
