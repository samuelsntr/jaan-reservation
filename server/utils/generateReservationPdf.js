const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateReservationPdf = (reservation) => {
  const doc = new PDFDocument({ margin: 50 });
  const filename = `reservation-${reservation.id}.pdf`;
  const filePath = path.join(__dirname, "..", "pdfs", filename);

  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // === Logo and Branding ===
  const logoPath = path.join(__dirname, "..", "assets", "jaan-logo.png"); // Replace with actual path
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 45, { width: 60 });
  }

  doc
    .fontSize(20)
    .fillColor("#222")
    .text("JA'AN Restaurant", 120, 50, { align: "left" })
    .fontSize(10)
    .fillColor("#666")
    .text("Jl. Sudirman No.123, Jakarta", 120, 75)
    .text("Phone: +62 812-3456-7890", 120, 90)
    .text("Instagram: @jaan.restaurant", 120, 105);

  doc.moveDown(2);

  // === Title Section ===
  doc
    .fontSize(16)
    .fillColor("#000")
    .text("Reservation Confirmation", { align: "center" })
    .moveDown(0.5);
  doc
    .fontSize(11)
    .fillColor("#444")
    .text("This document confirms your reservation details.", { align: "center" })
    .moveDown(1);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("#ccc").moveDown(1.5);

  // === Reservation Information ===
  const labelStyle = { continued: true, width: 200 };
  const valueStyle = { align: "left" };

  const detail = (label, value) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#333")
      .text(`${label}: `, labelStyle)
      .font("Helvetica")
      .fillColor("#000")
      .text(value, valueStyle)
      .moveDown(0.5);
  };

  detail("Reservation ID", reservation.id);
  detail("Name", reservation.name);
  detail("Phone Number", reservation.phoneNumber);
  detail("Date", reservation.date);
  detail("Time", reservation.time);
  detail("Number of Pax", reservation.pax);
  detail("Table / Sofa", reservation.tableType);

  doc.moveDown(1);

  // === Notes Section ===
  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke("#eee")
    .moveDown(1);

  doc
    .fontSize(11)
    .fillColor("#555")
    .text(
      "• Please arrive at least 10 minutes before your scheduled time.\n" +
        "• Minimum spend may apply for sofa and special table types.\n" +
        "• For changes or cancellations, contact us at least 2 hours before your reservation.",
      { lineGap: 4 }
    )
    .moveDown(1);

  doc
    .fontSize(11)
    .fillColor("#222")
    .text(
      "Thank you for choosing JA'AN. We look forward to welcoming you!",
      { align: "center" }
    );

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};

module.exports = generateReservationPdf;
