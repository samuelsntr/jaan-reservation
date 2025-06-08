const { Reservation, sequelize } = require("../models");
const { Op } = require("sequelize");

exports.getDashboardSummary = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const [
      totalReservations,
      totalPaxToday,
      totalConfirmed,
      totalPending,
      reservationsPerDay,
      tableTypeDistribution,
      floorDistribution,
    ] = await Promise.all([
      Reservation.count(),

      Reservation.sum("pax", {
        where: { date: today },
      }),

      Reservation.count({
        where: { status: "confirmed" },
      }),

      Reservation.count({
        where: { status: "pending" },
      }),

      Reservation.findAll({
        attributes: [
          "date",
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        group: ["date"],
        order: [["date", "ASC"]],
      }),

      Reservation.findAll({
        attributes: [
          "tableType",
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        group: ["tableType"],
      }),

      Reservation.findAll({
        attributes: [
          "floor",
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        group: ["floor"],
      }),
    ]);

    res.json({
      kpis: {
        totalReservations,
        totalPaxToday: totalPaxToday || 0,
        totalConfirmed,
        totalPending,
      },
      trends: {
        reservationsPerDay,
      },
      charts: {
        tableTypeDistribution,
        floorDistribution,
      },
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
