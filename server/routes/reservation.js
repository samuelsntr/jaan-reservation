const express = require("express");
const router = express.Router();
const controller = require("../controllers/reservationController");
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.post("/", controller.createReservation);
router.get("/", isAuthenticated, controller.getReservations);
router.put("/confirm/:id", isAuthenticated, isAdmin, controller.confirmReservation);
router.put("/reject/:id", isAuthenticated, isAdmin, controller.rejectReservation);

module.exports = router;
