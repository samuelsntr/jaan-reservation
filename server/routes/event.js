const express = require("express");
const router = express.Router();
const controller = require("../controllers/eventController");
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Public route for reservation form
router.get("/", controller.getEvents);

// Get event by date - public
router.get("/date/:date", controller.getEventByDate);

// Admin only routes
router.post("/", isAuthenticated, isAdmin, controller.createEvent);
router.put("/:id", isAuthenticated, isAdmin, controller.updateEvent);
router.delete("/:id", isAuthenticated, isAdmin, controller.deleteEvent);

module.exports = router;

