const express = require("express");
const router = express.Router();
const controller = require("../controllers/reservationController");

router.post("/", controller.createReservation);
router.get("/", controller.getReservations);
router.put("/confirm/:id", controller.confirmReservation);
router.put("/reject/:id", controller.rejectReservation);

module.exports = router;
