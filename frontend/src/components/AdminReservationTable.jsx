import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/lib/axios";
import PaginationControls from "./PaginationControls";
import ReservationCard from "../components/ReservationCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarX } from "lucide-react";
import DatePopover from "./DatePopover";
import { Button } from "@/components/ui/button";
import { useReservationRefresh } from "@/contexts/ReservationRefreshContext";

export default function AdminReservationTable() {
  const { refreshCount } = useReservationRefresh();
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Fixed per page
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page,
          limit,
        });
        if (statusFilter !== "all") {
          params.append("status", statusFilter);
        }
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const res = await api.get(`/reservations?${params.toString()}`);
        setReservations(res.data.data);
        setTotalPages(Math.ceil(res.data.total / limit));
      } catch (err) {
        console.error("Error fetching reservations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [page, limit, statusFilter, startDate, endDate, refreshCount]);

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

  return (
    <div className="max-w-full">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Reservation Management
          </h2>
          <Badge variant="outline" className="text-sm">
            {reservations.length} Total Reservations
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-4">
            <DatePopover
              label="Start Date"
              date={startDate}
              onChange={setStartDate}
            />
            <DatePopover
              label="End Date"
              date={endDate}
              onChange={setEndDate}
            />
          </div>

          {(startDate || endDate || statusFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
                setStatusFilter("all");
                setPage(1);
              }}
              className="flex items-center gap-2"
            >
              <CalendarX className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <Tabs
        value={statusFilter}
        onValueChange={(val) => {
          setStatusFilter(val);
          setPage(1); // reset to page 1
        }}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {reservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
          <CalendarX className="w-16 h-16 mb-4" />
          <p className="text-lg">No reservations found</p>
          <p className="text-sm">Try changing the filter or check back later</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
