import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

const REJECTION_REASONS = [
  {
    id: "fully-booked",
    title: "Fully Booked",
    message:
      "Unfortunately, we are fully booked for your requested date and time. We apologize for any inconvenience.",
  },
  {
    id: "table-unavailable",
    title: "Requested Table Unavailable",
    message:
      "The table type you requested is not available for your chosen date and time. Please consider selecting a different table type or time slot.",
  },
  {
    id: "closing-hours",
    title: "Outside Operating Hours",
    message:
      "Your requested time falls outside our operating hours. Please choose a time within our business hours.",
  },
  {
    id: "maintenance",
    title: "Maintenance/Closed",
    message:
      "We will be closed for maintenance on your requested date. We apologize for the inconvenience.",
  },
  {
    id: "large-party",
    title: "Large Party (Special Arrangements Required)",
    message:
      "Your party size requires special arrangements. Please contact us directly at +62 819-1900-1818 to discuss your reservation.",
  },
  {
    id: "duplicate",
    title: "Duplicate Reservation",
    message:
      "We notice you may have multiple reservations. Please confirm which one you'd like to keep by contacting us.",
  },
  {
    id: "custom",
    title: "Custom Reason",
    message: "",
  },
];

export default function RejectReservationDialog({
  isOpen,
  onClose,
  onConfirm,
  reservation,
  isRejecting,
}) {
  const [selectedReason, setSelectedReason] = useState("fully-booked");
  const [customMessage, setCustomMessage] = useState("");

  const handleConfirm = () => {
    const reason = REJECTION_REASONS.find((r) => r.id === selectedReason);
    const message =
      selectedReason === "custom" ? customMessage : reason.message;

    if (selectedReason === "custom" && !customMessage.trim()) {
      return; // Don't submit if custom is selected but empty
    }

    onConfirm({
      reasonId: selectedReason,
      reasonTitle: reason.title,
      message: message,
    });
  };

  const handleClose = () => {
    setSelectedReason("fully-booked");
    setCustomMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Reject Reservation
          </DialogTitle>
          <DialogDescription>
            Select a reason for rejecting{" "}
            <span className="font-semibold text-foreground">
              {reservation?.name}'s
            </span>{" "}
            reservation. A WhatsApp message will be sent to the customer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Rejection Reason</Label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger id="rejection-reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {REJECTION_REASONS.map((reason) => (
                  <SelectItem key={reason.id} value={reason.id}>
                    {reason.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedReason === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="custom-message">Custom Message</Label>
              <Textarea
                id="custom-message"
                placeholder="Enter your custom rejection reason..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                This message will be sent to the customer via WhatsApp.
              </p>
            </div>
          )}

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <p className="text-sm font-medium">Preview Message:</p>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {selectedReason === "custom"
                ? customMessage || "Your custom message will appear here..."
                : REJECTION_REASONS.find((r) => r.id === selectedReason)
                    ?.message}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isRejecting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={
              isRejecting ||
              (selectedReason === "custom" && !customMessage.trim())
            }
          >
            {isRejecting ? "Rejecting..." : "Reject & Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
