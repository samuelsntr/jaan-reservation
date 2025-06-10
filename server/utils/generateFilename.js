// utils/generateFilename.js
function sanitizeFilename(str) {
    return str.replace(/\s+/g, "");
}

function generateReservationPdfFilename(reservation) {
    const formattedDate = reservation.date.replace(/-/g, "");
    const tableCode = reservation.tableType.toUpperCase().replace(/\s+/g, "");
    const reservationCode = `${formattedDate}-${tableCode}-${reservation.id}`;
    const safeName = sanitizeFilename(reservation.name);
    return `reservation-${safeName}-${reservationCode}.pdf`;
}

module.exports = { generateReservationPdfFilename };