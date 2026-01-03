const { Reservation } = require("../models");
const generateReservationPdf = require("../utils/generateReservationPdf");
const path = require("path");
require('dotenv').config();
const { Op } = require("sequelize");
const { emitNewReservation } = require("../utils/socket");
const { generateReservationPdfFilename  } = require("../utils/generateFilename");
const { sendWhatsAppMessage, formatReservationMessage, formatRejectionMessage } = require("../utils/sleekflow");

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
        const filename = generateReservationPdfFilename(resJson);
        resJson.pdfUrl = `${process.env.BASE_URL}/pdfs/${filename}`;
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

    // Find and update reservation
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    reservation.status = "confirmed";
    await reservation.save();

    // Generate PDF confirmation letter
    const pdfPath = await generateReservationPdf(reservation);
    const pdfFileName = path.basename(pdfPath);
    const pdfUrl = `${req.protocol}://${req.get("host")}/pdfs/${pdfFileName}`;

    // Send WhatsApp notification
    let whatsappResult = { success: false };
    
    if (reservation.phoneNumber) {
      const message = formatReservationMessage(reservation, pdfUrl);
      whatsappResult = await sendWhatsAppMessage({
        phoneNumber: reservation.phoneNumber,
        message: message,
      });
    } else {
      console.warn("⚠️ No phone number, skipping WhatsApp");
    }

    // Respond with confirmation
    res.json({
      message: "Reservation confirmed",
      pdfUrl,
      whatsappSent: whatsappResult.success,
      whatsappError: whatsappResult.success ? null : whatsappResult.error,
    });
  } catch (err) {
    console.error("Error confirming reservation:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

exports.rejectReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, reasonTitle } = req.body;

    // Find and update reservation
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    reservation.status = "rejected";
    await reservation.save();

    // Send rejection WhatsApp message
    let whatsappResult = { success: false };
    
    if (reservation.phoneNumber && reason) {
      const message = formatRejectionMessage(reservation, reason);
      whatsappResult = await sendWhatsAppMessage({
        phoneNumber: reservation.phoneNumber,
        message: message,
      });
    }

    res.json({
      message: "Reservation rejected",
      whatsappSent: whatsappResult.success,
      whatsappError: whatsappResult.success ? null : whatsappResult.error,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resendConfirmation = async (req, res) => {
  try {
    const { id } = req.params;

    // Find reservation
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.status !== "confirmed") {
      return res.status(400).json({ message: "Only confirmed reservations can be resent" });
    }

    // Get PDF URL
    const { generateReservationPdfFilename } = require("../utils/generateFilename");
    const pdfFileName = generateReservationPdfFilename(reservation.toJSON());
    const pdfUrl = `${req.protocol}://${req.get("host")}/pdfs/${pdfFileName}`;

    // Resend WhatsApp message
    const message = formatReservationMessage(reservation, pdfUrl);
    const whatsappResult = await sendWhatsAppMessage({
      phoneNumber: reservation.phoneNumber,
      message: message,
    });

    if (whatsappResult.success) {
      res.json({
        message: "Confirmation resent successfully",
        whatsappSent: true,
      });
    } else {
      res.status(500).json({
        message: "Failed to resend confirmation",
        error: whatsappResult.error,
      });
    }
  } catch (err) {
    console.error("Error resending confirmation:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

exports.updateShowUpStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { showedUp } = req.body;

    // Find reservation
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.status !== "confirmed") {
      return res.status(400).json({ message: "Only confirmed reservations can be marked" });
    }

    // Update showedUp status
    reservation.showedUp = showedUp;
    await reservation.save();

    // Optionally send WhatsApp message for no-shows
    if (showedUp === false && reservation.phoneNumber) {
      const noShowMessage = `Hi ${reservation.name},

We noticed you didn't make it to your reservation at *JA'AN Bali* today.

📋 *Reservation Details:*
📅 Date: ${reservation.date}
🕐 Time: ${reservation.time}
👥 Pax: ${reservation.pax} people

We hope everything is okay. If you'd like to reschedule, please contact us at +62 819-1900-1818.

We look forward to serving you soon!

_JA'AN Bali_
📞 +62 819-1900-1818
📷 @jaanbali`;

      await sendWhatsAppMessage({
        phoneNumber: reservation.phoneNumber,
        message: noShowMessage,
      });
    }

    res.json({
      message: `Marked as ${showedUp ? 'showed up' : 'no-show'}`,
      showedUp: reservation.showedUp,
    });
  } catch (err) {
    console.error("Error updating show-up status:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};
