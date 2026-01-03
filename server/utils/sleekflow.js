const axios = require("axios");
require("dotenv").config();

/**
 * Sleekflow WhatsApp Cloud API Integration
 * Sends WhatsApp messages for reservation confirmations
 */

const SLEEKFLOW_API_URL = "https://api.sleekflow.io/api/message/send/json";
const SLEEKFLOW_API_KEY = process.env.SLEEKFLOW_API_KEY;
const SLEEKFLOW_WHATSAPP_FROM = process.env.SLEEKFLOW_WHATSAPP_FROM;

/**
 * Format phone number to international format (Indonesia: 08xxx -> 628xxx)
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} - Formatted phone number
 */
function formatPhoneNumber(phoneNumber) {
  let formatted = phoneNumber.replace(/[^\d]/g, ""); // Remove non-digits
  
  // Convert Indonesian format (08xxx) to international (628xxx)
  if (formatted.startsWith("0")) {
    formatted = "62" + formatted.substring(1);
  }
  
  return formatted;
}

/**
 * Send WhatsApp message via Sleekflow
 * @param {Object} params - Message parameters
 * @param {string} params.phoneNumber - Customer phone number
 * @param {string} params.message - Message content
 * @returns {Promise<Object>} - Result object with success status
 */
async function sendWhatsAppMessage({ phoneNumber, message }) {
  try {
    // Validate configuration
    if (!SLEEKFLOW_API_KEY || !SLEEKFLOW_WHATSAPP_FROM) {
      throw new Error(
        "Sleekflow not configured. Set SLEEKFLOW_API_KEY and SLEEKFLOW_WHATSAPP_FROM in .env"
      );
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    console.log(`📱 Sending WhatsApp to ${formattedPhone}...`);

    const response = await axios.post(
      SLEEKFLOW_API_URL,
      {
        channel: "whatsappcloudapi",
        from: SLEEKFLOW_WHATSAPP_FROM,
        to: formattedPhone,
        messageType: "text",
        messageContent: message,
      },
      {
        headers: {
          "X-Sleekflow-Api-Key": SLEEKFLOW_API_KEY,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    );

    console.log(`✅ WhatsApp sent successfully (ID: ${response.data.id})`);

    return {
      success: true,
      messageId: response.data.id,
      phoneNumber: formattedPhone,
    };
  } catch (error) {
    console.error("❌ WhatsApp send failed:", error.response?.data || error.message);
    
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      phoneNumber: phoneNumber,
    };
  }
}

/**
 * Format WhatsApp message for reservation confirmation
 * @param {Object} reservation - Reservation data
 * @param {string} pdfUrl - URL to PDF (for reference)
 * @returns {string} - Formatted message
 */
function formatReservationMessage(reservation, pdfUrl) {
  return `🎉 *Reservation Confirmed* 🎉

Hi ${reservation.name},

Your reservation at *JA'AN Bali* has been confirmed!

📋 *Reservation Details:*
━━━━━━━━━━━━━━━━━━━━
📅 Date: ${formatDate(reservation.date)}
🕐 Time: ${reservation.time}
👥 Pax: ${reservation.pax} people
🏢 Floor: ${reservation.floor}
🪑 Table Type: ${reservation.tableType}
📞 Contact: ${reservation.phoneNumber}
━━━━━━━━━━━━━━━━━━━━

📄 Download your confirmation letter here:
${pdfUrl}

⚠️ *Important Notes:*
• Please arrive at least 10 minutes before your scheduled time
• Contact us at +62 819-1900-1818 for any changes
• Table will be released if not arrived by 10:45 PM

Thank you for choosing JA'AN! We look forward to welcoming you! 🙏

_JA'AN Bali_
📍 Jl. Raya Seminyak No.10, Seminyak, Bali
📞 +62 819-1900-1818
📷 @jaanbali`;
}

/**
 * Format WhatsApp message for reservation rejection
 * @param {Object} reservation - Reservation data
 * @param {string} reason - Rejection reason message
 * @returns {string} - Formatted rejection message
 */
function formatRejectionMessage(reservation, reason) {
  return `❌ *Reservation Update* ❌

Hi ${reservation.name},

We regret to inform you that we cannot accommodate your reservation request.

📋 *Reservation Details:*
━━━━━━━━━━━━━━━━━━━━
📅 Date: ${formatDate(reservation.date)}
🕐 Time: ${reservation.time}
👥 Pax: ${reservation.pax} people
🏢 Floor: ${reservation.floor}
🪑 Table Type: ${reservation.tableType}
━━━━━━━━━━━━━━━━━━━━

📝 *Reason:*
${reason}

We sincerely apologize for any inconvenience this may cause. Please feel free to:
• Choose a different date or time
• Contact us at +62 819-1900-1818 for alternative arrangements
• Visit our Instagram @jaanbali for updates on availability

We hope to serve you soon!

_JA'AN Bali_
📍 Jl. Raya Seminyak No.10, Seminyak, Bali
📞 +62 819-1900-1818
📷 @jaanbali`;
}

/**
 * Format date for display
 * @param {string} dateStr - Date string
 * @returns {string} - Formatted date
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

module.exports = {
  sendWhatsAppMessage,
  formatReservationMessage,
  formatRejectionMessage,
};

