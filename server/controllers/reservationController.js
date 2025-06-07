const { Reservation } = require("../models");
const generateReservationPdf = require("../utils/generateReservationPdf");
const path = require("path");
require('dotenv').config();
const { Op } = require("sequelize");
const { emitNewReservation } = require("../utils/socket");

exports.createReservation = async (req, res) => {
  try {
    const data = await Reservation.create(req.body);
    emitNewReservation(data);
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
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const where = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    } else if (startDate) {
      where.date = {
        [Op.gte]: new Date(startDate),
      };
    } else if (endDate) {
      where.date = {
        [Op.lte]: new Date(endDate),
      };
    }

    const total = await Reservation.count({ where });

    const data = await Reservation.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

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
