const { Reservation } = require("../models");
const generateReservationPdf = require("../utils/generateReservationPdf"); // import utility
const path = require("path");
require('dotenv').config();

exports.createReservation = async (req, res) => {
  try {
    const data = await Reservation.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    // Build filter object
    const where = {};
    if (status && status !== "all") {
      where.status = status;
    }

    // Count filtered records
    const total = await Reservation.count({ where });

    // Fetch paginated & filtered records
    const data = await Reservation.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    // Append pdfUrl if status is confirmed
    const withPdfUrl = data.map((reservation) => {
      const resJson = reservation.toJSON();
      if (resJson.status === "confirmed") {
        resJson.pdfUrl = `${process.env.BASE_URL}/pdfs/reservation-${resJson.id}.pdf`;
      }
      return resJson;
    });

    res.json({
      data: withPdfUrl,
      total,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.confirmReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find reservation
    const reservation = await Reservation.findByPk(id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    // 2. Update status to confirmed
    reservation.status = "confirmed";
    await reservation.save();

    // 3. Generate PDF
    const pdfPath = await generateReservationPdf(reservation);
    const pdfFileName = path.basename(pdfPath);

    // 5. Construct URL to serve PDF (optional for frontend download)
    const pdfUrl = `${req.protocol}://${req.get("host")}/pdfs/${pdfFileName}`;

    // 6. Respond with success
    res.json({
      message: "Reservation confirmed and WhatsApp sent",
      pdfUrl,
    });

  } catch (err) {
    console.error("Error confirming reservation:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

exports.rejectReservation = async (req, res) => {
  try {
    const { id } = req.params;
    await Reservation.update({ status: "rejected" }, { where: { id } });
    res.json({ message: "Reservation rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
