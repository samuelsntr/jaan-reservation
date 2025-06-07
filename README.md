# 📆 Reservation Management Dashboard

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
├── prisma/ or migrations/ # (optional) DB schema & migrations
└── README.md

## 🚀 Getting Started

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env     # Set your DB credentials and PORT
npm run dev              # Start development server

cd frontend
npm install
npm run dev              # Vite dev server
