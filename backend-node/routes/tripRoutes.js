// routes/tripRoutes.js
const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const { protect } = require("../middleware/authMiddleware"); 


router.post("/", protect, tripController.createTrip);

router.get("/", protect, tripController.getTrips);

router.get("/:id", protect, tripController.getTripById);

router.put("/:id", protect, tripController.updateTrip);

router.delete("/:id", protect, tripController.deleteTrip);


module.exports = router;
