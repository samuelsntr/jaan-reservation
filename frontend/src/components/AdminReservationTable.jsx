import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar } from "lucide-react";
import api from "@/lib/axios";
import PaginationControls from "./PaginationControls";
import ReservationCard from "../components/ReservationCard";

export default function AdminReservationTable() {
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Fixed per page
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/reservations?page=${page}&limit=${limit}`);
        const json = res.data; // ✅ Axios already returns parsed data
        setReservations(json.data);
        setTotalPages(Math.ceil(json.total / limit));
      } catch (err) {
        console.error("Error fetching reservations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [page, limit]);

  const updateStatus = async (id, status) => {
    try {
      if (status === "confirmed") {
        setConfirmingId(id);
        const res = await api.put(`/reservations/confirm/${id}`);
        toast.success(`Reservation confirmed. PDF generated.`);

        const updated = reservations.map((r) =>
          r.id === id
            ? { ...r, status: "confirmed", pdfUrl: res.data.pdfUrl }
            : r
        );
        setReservations(updated);
      } else if (status === "rejected") {
        await api.put(`/reservations/reject/${id}`);
        toast.success(`Reservation rejected.`);
        const updated = reservations.map((r) =>
          r.id === id ? { ...r, status: "rejected" } : r
        );
        setReservations(updated);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to update status.");
    } finally {
      setConfirmingId(null);
    }
  };

  const sendWhatsAppMessage = (res) => {
    if (!res.phoneNumber || !res.pdfUrl) {
      toast.error("Phone number or PDF link missing.");
      return;
    }

    const phone = res.phoneNumber.replace(/^0/, "62"); // convert 08xx to 628xx
    const message = encodeURIComponent(
      `Hi ${res.name}, your reservation is confirmed!\nHere is your confirmation PDF:\n${res.pdfUrl}`
    );

    const link = `https://wa.me/${phone}?text=${message}`;
    window.open(link, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Calendar className="w-12 h-12 mb-4" />
        <p className="text-lg">No reservations yet</p>
        <p className="text-sm">New reservations will appear here</p>
      </div>
    );
  }

  return (
    <div className="max-w-full p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Reservation Management
        </h2>
        <Badge variant="outline" className="text-sm">
          {reservations.length} Total Reservations
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {reservations.map((res) => (
          <ReservationCard
            key={res.id}
            reservation={res}
            confirmingId={confirmingId}
            updateStatus={updateStatus}
            sendWhatsAppMessage={sendWhatsAppMessage}
          />
        ))}
      </div>
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
