const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateReservationPdf = (reservation) => {
  const doc = new PDFDocument({ margin: 50 });

  const formattedDate = reservation.date.replace(/-/g, ""); // e.g., 20250606
  const tableCode = reservation.tableType.toUpperCase().replace(/\s+/g, "");
  const reservationCode = `${formattedDate}-PAX${reservation.pax}-${tableCode}`;
  const filename = `reservation-${reservation.name}-${reservationCode}.pdf`;
  const filePath = path.join(__dirname, "..", "pdfs", filename);

  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // === Branding & Header ===
  const logoPath = path.join(__dirname, "..", "assets", "jaan-logo.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 45, { width: 60 });
  }

  doc
    .fontSize(20)
    .fillColor("#222")
    .text("JA'AN Restaurant", 120, 50)
    .fontSize(10)
    .fillColor("#666")
    .text("Jl. Raya Seminyak No.10, Seminyak, Kec. Kuta, Kabupaten Badung, Bali 80361", 120, 75)
    .text("Phone: +62 819-1900-1818", 120, 90)
    .text("Instagram: @jaanbali", 120, 105);

  doc.moveDown(2);

  // === Title ===
  doc
    .fontSize(18)
    .fillColor("#000")
    .text("Reservation Confirmation", { align: "center" })
    .moveDown(0.3);

  doc
    .fontSize(11)
    .fillColor("#444")
    .text("This document confirms your reservation at JA'AN Restaurant.", { align: "center" });

  doc.moveDown(1);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("#ccc").moveDown(1.5);

  // === Reservation Details ===
  const detail = (label, value) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#333")
      .text(`${label}: `, { continued: true })
      .font("Helvetica")
      .fillColor("#000")
      .text(value)
      .moveDown(0.5);
  };

  detail("Reservation Code", reservationCode);
  detail("Name", reservation.name);
  detail("Phone Number", reservation.phoneNumber);
  detail("Date", reservation.date);
  detail("Time", reservation.time);
  detail("Number of Pax", reservation.pax);
  detail("Floor", reservation.floor);
  detail("Table Type", reservation.tableType);
  detail("Status", reservation.status.toUpperCase());

  doc.moveDown(1);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("#eee").moveDown(1);

  // === Notes ===
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#000")
    .text("Important Notes:")
    .moveDown(0.5);

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#444")
    .list([
      "Please arrive at least 10 minutes before your scheduled time.",
      "Minimum spend may apply for VIP or sofa table types.",
      "Contact us at least 2 hours in advance for any changes or cancellations.",
    ], { bulletRadius: 2, lineGap: 4 })
    .moveDown(1);

  // === Footer ===
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#222")
    .text("Thank you for choosing JA'AN.", { align: "center" });

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#555")
    .text("We look forward to welcoming you!", { align: "center" });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};

module.exports = generateReservationPdf;
