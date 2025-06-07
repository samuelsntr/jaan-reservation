import { useSocket } from "@/hooks/useSocket";
import { toast } from "sonner";
import { CalendarClock } from "lucide-react";
import { useReservationRefresh } from "@/contexts/ReservationRefreshContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { formatDate } from "../../lib/formatDate";

export default function DashboardLayout({ children }) {
  const { triggerRefresh } = useReservationRefresh();

  const playSound = () => {
    const audio = new Audio("/sounds/notif.mp3");
    audio.play().catch((err) => {
      console.error("Audio play failed:", err);
    });
  };

  useSocket("new-reservation", (data) => {
    console.log("New reservation received in frontend:", data);

    playSound(); // 🔊 Play the sound
    triggerRefresh(); // Trigger refresh of reservation data

    toast.custom((t) => (
      <div
        className="flex items-start gap-4 bg-green-50 dark:bg-green-900 border border-green-300 dark:border-green-700 p-4 rounded-lg shadow-md w-full max-w-sm"
        style={{
          animation: t.visible ? "fadeIn 0.3s ease" : "fadeOut 0.2s ease",
        }}
      >
        <CalendarClock
          className="text-green-600 dark:text-green-400 mt-1"
          size={24}
        />
        <div className="flex-1">
          <h4 className="font-semibold text-green-800 dark:text-green-200">
            New Reservation Received
          </h4>
          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
            {data.name} booked <strong>{data.pax}</strong> pax on{" "}
            <strong>{formatDate(data.date)}</strong> at{" "}
            <strong>{data.time}</strong>.
          </p>
        </div>
      </div>
    ));
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <main className="flex-1 h-full overflow-y-auto p-6">{children}</main>
    </SidebarProvider>
  );
}
