const { Event } = require("../models");
const { Op } = require("sequelize");

// Get events - public endpoint for reservation form
exports.getEvents = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let where = {};

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
    } else {
      // Default: next N days from today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + days);
      
      where.date = {
        [Op.between]: [today, futureDate],
      };
    }

    const events = await Event.findAll({
      where,
      order: [["date", "ASC"]],
    });

    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: err.message });
  }
};

// Create event - admin only
exports.createEvent = async (req, res) => {
  try {
    const { date, eventName, description } = req.body;

    if (!date || !eventName) {
      return res.status(400).json({ message: "Date and event name are required" });
    }

    // Check if event already exists for this date
    const existingEvent = await Event.findOne({ where: { date } });
    if (existingEvent) {
      return res.status(400).json({ message: "Event already exists for this date" });
    }

    const event = await Event.create({
      date,
      eventName,
      description: description || null,
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update event - admin only
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, eventName, description } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // If date is being changed, check if new date already has an event
    if (date && date !== event.date) {
      const existingEvent = await Event.findOne({ where: { date } });
      if (existingEvent) {
        return res.status(400).json({ message: "Event already exists for this date" });
      }
    }

    event.date = date || event.date;
    event.eventName = eventName || event.eventName;
    event.description = description !== undefined ? description : event.description;

    await event.save();

    res.json(event);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete event - admin only
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.destroy();

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get single event by date
exports.getEventByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const event = await Event.findOne({ where: { date } });

    if (!event) {
      return res.status(404).json({ message: "Event not found for this date" });
    }

    res.json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ message: err.message });
  }
};

