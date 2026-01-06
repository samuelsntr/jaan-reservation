const express = require("express");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const db = require("./models");
const reservationRoutes = require("./routes/reservation");
const dashboardRoutes = require("./routes/dashboard");
const eventRoutes = require("./routes/event");
const app = express();
const path = require("path");
const httpServer = require("http").createServer(app);
const { initSocket } = require("./utils/socket");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sessionStore = new SequelizeStore({
  db: db.sequelize,
});

initSocket(httpServer);

// Konfigurasi express-session
app.use(
  session({
    secret: "your-secret-key", // Ganti dengan string acak yang kuat
    resave: false,
    saveUninitialized: false,
    store: sessionStore, // <-- use this
    cookie: {
      secure: false, // Set true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    }
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Serve static files from "pdfs" folder
app.use("/pdfs", express.static(path.join(__dirname, "pdfs")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// AUTH ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/events", eventRoutes);

// Test route
app.get("/", (req, res) => res.send("Jaan Reservation API running"));

// // Connect to DB and sync
// Note: alter: true will create new tables automatically
// Change to alter: false in production after initial setup
db.sequelize.sync({ alter: false }).then(() => {
  console.log("Database connected and tables synced!");
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
