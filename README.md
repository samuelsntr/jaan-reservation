# 📆 Jaan Reservation Management

A modern full-stack reservation management dashboard built with **React**, **ShadCN UI**, **Lucide Icons**, **Express.js**, and **MySQL**. Designed for restaurants, studios, or service-based businesses that need real-time booking management, notifications, reporting, and more.

## ✨ Features

- ✅ Real-time reservation updates via **WebSockets**
- 📅 Calendar-based reservation tracking
- 📢 Sound + toast notification for new bookings
- 🔒 Role-based access (admin, staff)
- 📊 Insightful dashboard with charts and KPIs
- 🔍 Advanced filtering and export (Excel, PDF)
- 👤 User, review, and vendor management
- 💬 Integrated inbox and message handling
- 📦 Modular architecture (Reservation, Review, Dirasha, Inspection, etc.)
- 🌗 Dark mode ready

## 📁 Project Structure

├── frontend/ # React (Vite) App
│ ├── components/ # Shared UI components
│ ├── hooks/ # Custom hooks (useSocket, useFetch, etc.)
│ ├── pages/ # Page views
│ ├── layouts/ # Layouts like DashboardLayout
│ └── App.jsx # Main app entry
├── backend/ # Express.js API
│ ├── models/ # Sequelize models
│ ├── controllers/ # API controllers
│ ├── routes/ # Route definitions
│ ├── socket.js # WebSocket setup
│ └── server.js # Entry point
├── public/ # Static assets (e.g., notif sounds)
└── README.md

## 🛠️ Tech Stack

| Layer     | Technology                     |
|-----------|--------------------------------|
| Frontend  | React, Vite, Shadcn UI         |
| Backend   | Express.js, Sequelize ORM      |
| Database  | MySQL                          |
| Realtime  | Socket.IO                      |
| Styling   | Tailwind CSS, Lucide Icons     |
| Exporting | ExcelJS, pdf-lib               |

---

## 🧪 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/samuelsntr/jaan-reservation.git
cd jaan-reservation

# Backend setup
cd server
npm install
cp .env.example .env
# Fill in your database credentials
npm run dev

# Frontend setup
cd frontend
npm install
npm run dev
