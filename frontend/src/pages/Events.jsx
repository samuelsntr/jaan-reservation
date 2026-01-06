import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Pencil, Trash2, X } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useDeleteDialog } from "@/hooks/useDeleteDialog";
import { formatDate } from "@/lib/formatDate";
import { cn } from "@/lib/utils";

// Format date as YYYY-MM-DD in local timezone (not UTC)
const formatDateLocal = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    date: null,
    eventName: "",
    description: "",
  });
  const [calendarOpen, setCalendarOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events?days=30");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      toast.error("Failed to fetch events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenForm = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      // Parse date string (YYYY-MM-DD) to local Date object
      const [year, month, day] = event.date.split("-").map(Number);
      const eventDate = new Date(year, month - 1, day);
      setFormData({
        date: eventDate,
        eventName: event.eventName,
        description: event.description || "",
      });
    } else {
      setSelectedEvent(null);
      setFormData({
        date: null,
        eventName: "",
        description: "",
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedEvent(null);
    setFormData({
      date: null,
      eventName: "",
      description: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.eventName.trim()) {
      toast.error("Please fill in date and event name");
      return;
    }

    try {
      const dateString = formatDateLocal(formData.date); // Format in local timezone
      if (selectedEvent) {
        await api.put(`/events/${selectedEvent.id}`, {
          date: dateString,
          eventName: formData.eventName.trim(),
          description: formData.description.trim() || null,
        });
        toast.success("Event updated successfully");
      } else {
        await api.post("/events", {
          date: dateString,
          eventName: formData.eventName.trim(),
          description: formData.description.trim() || null,
        });
        toast.success("Event created successfully");
      }
      fetchEvents();
      handleCloseForm();
    } catch (err) {
      console.error("Error saving event:", err);
      toast.error(err.response?.data?.message || "Failed to save event");
    }
  };

  const { DeleteDialog, confirmDelete } = useDeleteDialog(
    (id) => api.delete(`/events/${id}`),
    {
      onSuccess: fetchEvents,
      successMessage: "Event deleted successfully",
      title: "Delete Event",
      description: "Are you sure you want to delete this event?",
    }
  );

  // Sort events by date
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Events Calendar</h2>
            <p className="text-muted-foreground mt-1">
              Manage events and band names for specific dates
            </p>
          </div>
          <Button onClick={() => handleOpenForm()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        <Card className="p-6">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No events scheduled yet.</p>
              <p className="text-sm mt-2">Click "Add Event" to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEvents.map((event) => {
                  // Parse date string (YYYY-MM-DD) to local Date object
                  const [year, month, day] = event.date.split("-").map(Number);
                  const eventDate = new Date(year, month - 1, day);
                  const dayNames = [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ];
                  const dayName = dayNames[eventDate.getDay()];

                  return (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        {formatDate(eventDate)}
                      </TableCell>
                      <TableCell>{dayName}</TableCell>
                      <TableCell>{event.eventName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {event.description || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenForm(event)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmDelete(event.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Add/Edit Event Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedEvent ? "Edit Event" : "Add New Event"}
              </DialogTitle>
              <DialogDescription>
                {selectedEvent
                  ? "Update the event details below."
                  : "Create a new event for a specific date. This will appear on the reservation form."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? (
                        formatDate(formData.date)
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => {
                        setFormData({ ...formData, date });
                        setCalendarOpen(false);
                      }}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name *</Label>
                <Input
                  id="eventName"
                  value={formData.eventName}
                  onChange={(e) =>
                    setFormData({ ...formData, eventName: e.target.value })
                  }
                  placeholder="e.g., Live Band: The Rockers"
                />
                <p className="text-xs text-muted-foreground">
                  If left empty, will show "Ja'an Bali [DayOfWeek]"
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Additional details about the event..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseForm}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedEvent ? "Update" : "Create"} Event
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <DeleteDialog />
      </div>
    </DashboardLayout>
  );
}
