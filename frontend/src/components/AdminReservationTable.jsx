import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  FileText,
  Check,
  X,
  Calendar,
  Users,
  Phone,
  Clock,
  MessageSquare,
  Loader2,
} from "lucide-react";
import api from "@/lib/axios";

export default function AdminReservationTable() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);

  const fetchReservations = async () => {
    try {
      const res = await api.get("/reservations");
      setReservations(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reservations.map((res) => (
          <Card
            key={res.id}
            className="p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {res.name}
                  </h3>
                  <Badge
                    className={`ml-2 ${
                      res.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : res.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : res.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {res.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{res.pax} pax</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(res.date), "PPP")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{res.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{res.phoneNumber}</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {res.tableType}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2">
                {res.status === "pending" && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => updateStatus(res.id, "confirmed")}
                      disabled={confirmingId === res.id}
                      className="flex-1 sm:flex-none transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-green-600"
                    >
                      {confirmingId === res.id ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />{" "}
                          Confirming...
                        </>
                      ) : (
                        <>
                          <Check size={16} className="mr-2" /> Confirm
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => updateStatus(res.id, "rejected")}
                      className="flex-1 sm:flex-none transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-red-600"
                    >
                      <X size={16} className="mr-2" /> Reject
                    </Button>
                  </>
                )}

                {res.status === "confirmed" && (
                  <div className="flex gap-2 w-full flex-col sm:flex-row justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (res.pdfUrl) {
                          window.open(res.pdfUrl, "_blank");
                        } else {
                          toast("PDF not available. Try confirming again.");
                        }
                      }}
                      className="w-full sm:w-auto"
                    >
                      <FileText size={16} className="mr-2" /> View PDF
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => sendWhatsAppMessage(res)}
                      className="w-full sm:w-auto"
                    >
                      <Phone size={16} className="mr-2" /> Send via WhatsApp
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
