import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  UserCog,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const sectionMap = {
  "/dashboard": "general",
  "/user": "settings",
  "/reservation-table": "settings",
};

function SidebarSection({
  id,
  title,
  children,
  sectionStates,
  setSectionStates,
  collapsed,
}) {
  const isOpen = sectionStates[id];
  const toggleSection = () => {
    setSectionStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mb-2">
      <button
        onClick={toggleSection}
        className={`flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-500 uppercase w-full hover:bg-gray-100 transition ${
          collapsed ? "justify-center" : ""
        }`}
      >
        {!collapsed && title}
        {!collapsed &&
          (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
      </button>
      {isOpen && !collapsed && (
        <div className="flex flex-col gap-1 mt-1">{children}</div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [sectionStates, setSectionStates] = useState({
    general: true,
    settings: true,
  });

  useEffect(() => {
    const currentPath = Object.keys(sectionMap).find((key) =>
      location.pathname.startsWith(key)
    );
    if (currentPath) {
      const section = sectionMap[currentPath];
      setSectionStates((prev) => ({ ...prev, [section]: true }));
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-[#f0eae7] text-[#612c06]"
        : "text-gray-700 hover:bg-[#f5f1ef]"
    }`;

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-white border-r shadow-sm flex flex-col justify-between h-screen transition-all duration-300`}
    >
      <div>
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <span className="text-xl font-bold">
              {user?.role === "admin" ? "Admin Panel" : "Dashboard"}
            </span>
          )}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="text-gray-500 hover:text-gray-800"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-3 text-sm">
          <SidebarSection
            id="general"
            title="General"
            sectionStates={sectionStates}
            setSectionStates={setSectionStates}
            collapsed={collapsed}
          >
            <NavLink to="/dashboard" className={linkClass}>
              <Home size={18} /> {!collapsed && "Dashboard"}
            </NavLink>
            <NavLink to="/reservation-table" className={linkClass}>
              <ClipboardCheck size={18} /> {!collapsed && "Reservations"}
            </NavLink>
          </SidebarSection>

          {user?.role === "admin" && (
            <SidebarSection
              id="settings"
              title="Settings"
              sectionStates={sectionStates}
              setSectionStates={setSectionStates}
              collapsed={collapsed}
            >
              <NavLink to="/user" className={linkClass}>
                <UserCog size={18} /> {!collapsed && "User Management"}
              </NavLink>
            </SidebarSection>
          )}
        </nav>
      </div>

      <div className="p-4 border-t">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center gap-2 justify-center text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </Button>
      </div>
    </aside>
  );
}
