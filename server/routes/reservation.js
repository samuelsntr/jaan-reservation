const express = require("express");
const router = express.Router();
const controller = require("../controllers/reservationController");
const { isAuthenticated } = require('../middleware/auth');

router.post("/", controller.createReservation);
router.get("/", isAuthenticated, controller.getReservations);
router.put("/confirm/:id", isAuthenticated, controller.confirmReservation);
router.put("/reject/:id", isAuthenticated, controller.rejectReservation);
router.post("/resend/:id", isAuthenticated, controller.resendConfirmation);

module.exports = router;
