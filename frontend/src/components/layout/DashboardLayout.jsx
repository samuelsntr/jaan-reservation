import Sidebar from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Fixed height for sidebar */}
      <div className="h-full">
        <Sidebar />
      </div>

      {/* Main content is scrollable */}
      <main className="flex-1 h-full overflow-y-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {user ? `Welcome, ${user.username}` : "Admin"}
          </h1>
        </header>
        {children}
      </main>
    </div>
  );
}
