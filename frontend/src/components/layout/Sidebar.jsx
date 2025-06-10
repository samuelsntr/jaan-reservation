import { Home, Calendar, Users, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"; // Assuming these are well-designed UI components
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ModeToggle } from "../mode-toggle";

// Define navigation items
const primaryNavigation = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/dashboard",
  },
  {
    title: "Reservations",
    icon: Calendar,
    url: "/reservation-table",
  },
];

const adminNavigation = [
  {
    title: "User Management",
    icon: Users,
    url: "/user",
  },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar className="h-screen flex flex-col">
      <SidebarContent className="flex-grow">
        {/* Application Navigation */}
        <div className="ml-4 mt-3">
          <ModeToggle />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                         ${
                           isActive
                             ? "bg-primary text-primary-foreground"
                             : "text-muted-foreground hover:bg-muted hover:text-foreground"
                         }`
                      }
                    >
                      <item.icon className="h-5 w-5" />{" "}
                      {/* Slightly larger icons */}
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Navigation (conditionally rendered) */}
        {user?.role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavigation.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                           ${
                             isActive
                               ? "bg-primary text-primary-foreground"
                               : "text-muted-foreground hover:bg-muted hover:text-foreground"
                           }`
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Logout Button */}
      <div className="p-4 border-t border-border mt-auto">
        {" "}
        {/* Added border-border for theme compatibility */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="w-full flex items-center gap-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg px-3 py-2 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}
