const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { generateReservationPdfFilename } = require("./generateFilename");

const generateReservationPdf = (reservation) => {
  // Set A4 size (595.28 x 841.89 points)
  const doc = new PDFDocument({ 
    size: 'A4',
    margin: 50,
    layout: 'portrait'
  });
  
  const filename = generateReservationPdfFilename(reservation);
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
    .text("Reservation Confirmation", { align: "center", width: 355 })
    .moveDown(0.3);

  doc
    .fontSize(11)
    .fillColor("#444")
    .text("This document confirms your reservation at JA'AN Restaurant.", { align: "center", width: 355 });

  doc.moveDown(1);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#ccc").moveDown(1.5);

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

  // Generate reservation code from filename
  const reservationCode = `${reservation.date.replace(/-/g, "")}-${reservation.tableType.toUpperCase().replace(/\s+/g, "")}-${reservation.id}`
  
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
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#eee").moveDown(1);

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
      "We will hold your reservation until 10:45 PM. If you haven't arrived by then, the table will be automatically released.",
      "If you're already at Jaan Bali after 10:45 PM, we will try our best to find an available table or sofa for you.",
    ], { bulletRadius: 2, lineGap: 4 })
    .moveDown(1);
  
  // === Footer ===
  doc.moveDown(2);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#222")
    .text("Thank you for choosing JA'AN.", { align: "center", width: 355 });

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#555")
    .text("We look forward to welcoming you!", { align: "center", width: 355 });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};

module.exports = generateReservationPdf;
