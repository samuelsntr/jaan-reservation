import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/Users";
import EventsPage from "./pages/Events";
import ProtectedRoute from "@/components/ProtectedRoute";
import ReservationPage from "./pages/Reservation";
import ReservationTablePage from "./pages/ReservationTablePage";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={user.role === "admin" ? "/dashboard" : "/reservation-table"}
              />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/reservations" element={<ReservationPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservation-table"
          element={
            <ProtectedRoute>
              <ReservationTablePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
