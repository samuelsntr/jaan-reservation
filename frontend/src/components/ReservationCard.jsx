import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  Clock,
  Phone,
  Building2,
  FileText,
  Check,
  X,
  Loader2,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/formatDate";

export default function ReservationCard({
  reservation,
  confirmingId,
  updateStatus,
  handleResendConfirmation,
  isResending,
}) {
  const res = reservation;

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="outline" className="text-green-500 ml-2">
            <CheckCircle className="w-4 h-4" />
            CONFIRMED
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-500 ml-2">
            <XCircle className="w-4 h-4" />
            REJECTED
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-500 ml-2">
            <Clock className="w-4 h-4" />
            PENDING
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-500 ml-2">
            <HelpCircle className="w-4 h-4" />
            Unknown
          </Badge>
        );
    }
  };

  return (
    <Card
      key={res.id}
      className="p-4 hover:shadow-md transition-shadow duration-200 bg-card text-card-foreground"
    >
      <div className="flex flex-col gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">
              {res.name}
            </h3>
            {getStatusBadge(res.status)}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{res.pax} pax</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(res.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{res.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{res.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>{res.floor}</span>
            </div>
          </div>

          <p className="text-sm font-medium text-foreground">{res.tableType}</p>
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
                    <Loader2 size={16} className="mr-2 animate-spin" />
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
                    toast({
                      title: "PDF not available. Try confirming again.",
                    });
                  }
                }}
                className="w-full sm:w-auto"
              >
                <FileText size={16} className="mr-2" /> View PDF
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleResendConfirmation(res)}
                disabled={isResending === res.id}
                className="w-full sm:w-auto"
              >
                {isResending === res.id ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Phone size={16} className="mr-2" /> Resend Confirmation
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
