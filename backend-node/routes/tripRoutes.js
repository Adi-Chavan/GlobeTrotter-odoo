// routes/tripRoutes.js
const express = require("express");
const router = express.Router();
const tripController = require("../controller/tripController");
const { protect } = require("../middleware/authMiddleware"); 

// POST create trip
router.post("/", protect, tripController.createTrip);

// GET public trips (no auth required)
router.get("/public", tripController.getPublicTrips);

// GET shared trip by shareId (no auth required)
router.get("/shared/:shareId", tripController.getSharedTrip);

// POST generate share link
router.post("/:id/share", protect, tripController.generateShareLink);

// PUT toggle trip visibility
router.put("/:id/visibility", protect, tripController.toggleTripVisibility);

// GET all user trips
router.get("/", protect, tripController.getTrips);

// GET trip by ID
router.get("/:id", protect, tripController.getTripById);

// PUT update trip
router.put("/:id", protect, tripController.updateTrip);

// DELETE trip
router.delete("/:id", protect, tripController.deleteTrip);

module.exports = router;
