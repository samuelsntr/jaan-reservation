import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  CalendarIcon,
  CheckCircle,
  User,
  Phone,
  Users,
  Clock,
  Sparkles,
  Table as TableIcon,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Generate time slots from 20:00 to 23:00 WITA (30 min intervals)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 20; hour <= 23; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < 23) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots;
};

const QUICK_TIMES = generateTimeSlots(); // ["20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"]
const tableOptions = ["Table 4 pax", "Table 6 pax", "Sofa 6-10 pax", "Bar"];

// Generate next 7 days
const generateDateOptions = () => {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};

// Get day name (full)
const getDayName = (date) => {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayNames[date.getDay()];
};

// Get short day name (for mobile)
const getShortDayName = (date) => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return dayNames[date.getDay()];
};

// Format date for display (e.g., "Jan 9")
const formatDateShort = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

// Get default event name
const getDefaultEventName = (date) => {
  const dayName = getDayName(date);
  return `Ja'an Bali ${dayName}`;
};

// Format date as YYYY-MM-DD in local timezone (not UTC)
const formatDateLocal = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function ReservationForm() {
  // Set today as default date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    pax: "",
    tableType: "",
    time: "",
    date: today, // Default to today's date
    floor: "First Floor", // Auto-set to First Floor
  });

  const [submitting, setSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [dateOptions] = useState(generateDateOptions());

  // Fetch events for next 7 days
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const response = await api.get("/events?days=7");
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        // Continue without events - will use defaults
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // Get event name for a date
  const getEventName = (date) => {
    const dateString = formatDateLocal(date);
    const event = events.find((e) => e.date === dateString);
    return event ? event.eventName : getDefaultEventName(date);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: null });
    }

    // Auto-format phone number
    if (name === "phoneNumber") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length <= 10) {
        const formatted = cleaned.replace(
          /(\d{3})(\d{3})(\d{4})/,
          "($1) $2-$3"
        );
        setForm({ ...form, phoneNumber: formatted || cleaned });
      }
    }
  };

  const handleQuickTime = (time) => {
    setForm({ ...form, time });
    setFieldErrors({ ...fieldErrors, time: null });
  };

  const handleDateSelect = (date) => {
    setForm({ ...form, date });
    setFieldErrors({ ...fieldErrors, date: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const errors = {};
    if (!form.date) errors.date = "Please select a date";
    if (!form.time) errors.time = "Please select a time";
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.phoneNumber.trim())
      errors.phoneNumber = "Phone number is required";
    if (!form.pax || parseInt(form.pax) < 1)
      errors.pax = "Please enter number of guests";
    if (!form.tableType) errors.tableType = "Please select a table type";

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/reservations", {
        ...form,
        date: formatDateLocal(form.date), // Format as YYYY-MM-DD in local timezone
        pax: parseInt(form.pax),
        phoneNumber: form.phoneNumber.replace(/\D/g, ""), // Clean phone number
      });
      setShowSuccessDialog(true);
      // Reset to today's date
      const resetToday = new Date();
      resetToday.setHours(0, 0, 0, 0);
      setForm({
        name: "",
        phoneNumber: "",
        pax: "",
        tableType: "",
        time: "",
        date: resetToday, // Reset to today
        floor: "First Floor",
      });
      setFieldErrors({});
    } catch (err) {
      console.log(err);
      toast.error("Failed to submit reservation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-center">
            <img
              src="/jaan-logo.png"
              alt="JA'AN Restaurant Logo"
              className="h-20 w-auto object-contain"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Reserve Your Table
            </h2>
            <p className="text-gray-400 text-lg">
              Experience fine dining at JA'AN Restaurant
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-6 md:p-8 shadow-2xl border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Date Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Select Date
              </Label>
              {loadingEvents ? (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className="h-24 w-32 flex-shrink-0 bg-gray-700 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-3 md:overflow-x-visible">
                  {dateOptions.map((date) => {
                    const isSelected =
                      form.date &&
                      form.date.toDateString() === date.toDateString();
                    const eventName = getEventName(date);
                    const dayName = getDayName(date);
                    const shortDayName = getShortDayName(date);
                    const dateShort = formatDateShort(date);
                    const isToday =
                      date.toDateString() === new Date().toDateString();

                    return (
                      <Card
                        key={date.toISOString()}
                        className={cn(
                          "p-3 md:p-4 cursor-pointer transition-all duration-300 border-2 hover:scale-105 hover:shadow-lg flex-shrink-0 w-40 md:w-auto min-h-[100px] md:min-h-0",
                          isSelected
                            ? "border-amber-500 bg-amber-500/20 shadow-lg shadow-amber-500/20"
                            : "border-gray-700 bg-gray-700/50 hover:border-amber-600/50"
                        )}
                        onClick={() => handleDateSelect(date)}
                      >
                        <div className="space-y-1.5 md:space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-medium text-gray-400 uppercase md:normal-case">
                              <span className="md:hidden">{shortDayName}</span>
                              <span className="hidden md:inline">
                                {dayName}
                              </span>
                            </span>
                            {isToday && (
                              <span className="text-xs px-1.5 md:px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded whitespace-nowrap">
                                Today
                              </span>
                            )}
                          </div>
                          <div className="text-base md:text-lg font-bold text-white">
                            {dateShort}
                          </div>
                          <div className="text-xs md:text-xs text-gray-400 line-clamp-2 md:line-clamp-1 leading-tight">
                            {eventName}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
              {fieldErrors.date && (
                <p className="text-sm text-red-400 animate-in fade-in">
                  {fieldErrors.date}
                </p>
              )}
            </div>

            {/* Time Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Select Time (WITA)
              </Label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {QUICK_TIMES.map((time) => {
                  const isSelected = form.time === time;
                  const timeObj = new Date(`2000-01-01T${time}`);
                  const displayTime = timeObj.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  });

                  return (
                    <Button
                      key={time}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => handleQuickTime(time)}
                      className={cn(
                        "h-12 transition-all duration-200",
                        isSelected
                          ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-500 shadow-lg shadow-amber-500/30"
                          : "bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-amber-600/50 hover:text-amber-400"
                      )}
                    >
                      {displayTime}
                    </Button>
                  );
                })}
              </div>
              {fieldErrors.time && (
                <p className="text-sm text-red-400 animate-in fade-in">
                  {fieldErrors.time}
                </p>
              )}
            </div>

            {/* Personal Information */}
            <div className="space-y-6 pt-4 border-t border-gray-700">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-400" />
                  Your Details
                </h3>
                <p className="text-gray-400 text-sm">
                  Tell us a bit about yourself
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-300 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={cn(
                      "h-12 text-base bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:border-amber-500 focus-visible:ring-amber-500/20",
                      fieldErrors.name &&
                        "border-red-500 focus-visible:ring-red-500/20"
                    )}
                    placeholder="Enter your full name"
                  />
                  {fieldErrors.name && (
                    <p className="text-sm text-red-400 animate-in fade-in">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium text-gray-300 flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className={cn(
                      "h-12 text-base bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:border-amber-500 focus-visible:ring-amber-500/20",
                      fieldErrors.phoneNumber &&
                        "border-red-500 focus-visible:ring-red-500/20"
                    )}
                    placeholder="(123) 456-7890"
                    maxLength={14}
                  />
                  {fieldErrors.phoneNumber && (
                    <p className="text-sm text-red-400 animate-in fade-in">
                      {fieldErrors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="pax"
                  className="text-sm font-medium text-gray-300 flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Number of Guests
                </Label>
                <Input
                  type="number"
                  id="pax"
                  name="pax"
                  value={form.pax}
                  onChange={handleChange}
                  className={cn(
                    "h-12 text-base bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:border-amber-500 focus-visible:ring-amber-500/20",
                    fieldErrors.pax &&
                      "border-amber-500 focus-visible:ring-amber-500/20"
                  )}
                  placeholder="How many people?"
                  min="1"
                  max="20"
                />
                {fieldErrors.pax && (
                  <p className="text-sm text-red-400 animate-in fade-in">
                    {fieldErrors.pax}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <TableIcon className="w-4 h-4" />
                  Table Type
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {tableOptions.map((option) => {
                    const isSelected = form.tableType === option;
                    return (
                      <Card
                        key={option}
                        className={cn(
                          "p-4 cursor-pointer transition-all duration-300 border-2 hover:scale-105 hover:shadow-lg",
                          isSelected
                            ? "border-amber-500 bg-amber-500/20 shadow-lg shadow-amber-500/20"
                            : "border-gray-700 bg-gray-700/50 hover:border-amber-600/50"
                        )}
                        onClick={() => {
                          setForm({ ...form, tableType: option });
                          setFieldErrors({ ...fieldErrors, tableType: null });
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <TableIcon
                            className={cn(
                              "w-5 h-5",
                              isSelected ? "text-amber-400" : "text-gray-400"
                            )}
                          />
                          <span
                            className={cn(
                              "font-medium",
                              isSelected ? "text-white" : "text-gray-300"
                            )}
                          >
                            {option}
                          </span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
                {fieldErrors.tableType && (
                  <p className="text-sm text-red-400 animate-in fade-in">
                    {fieldErrors.tableType}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-700">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-500/30 h-12 text-base font-medium"
              >
                {submitting ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Confirm Reservation
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Minimum Spend Note - Collapsible */}
        <Card className="p-6 bg-gray-800/50 border-gray-700">
          <details className="group">
            <summary className="font-semibold text-gray-200 cursor-pointer list-none flex items-center justify-between hover:text-white transition-colors">
              <span>Minimum Spend Information</span>
              <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-4 space-y-5 pt-4 border-t border-gray-700">
              <div className="flex flex-col md:flex-row md:space-x-8 md:space-y-0 space-y-5">
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-400 mb-2">
                    <span className="italic">Sunday until Thursday</span>
                  </div>
                  <ul className="space-y-2 ml-4">
                    {[
                      "Sofa 10 pax",
                      "Sofa 6 pax",
                      "Sofa 4 pax",
                      "Table 6 pax",
                      "Table 4 pax",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center text-gray-400"
                      >
                        <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                        {item}{" "}
                        <span className="ml-2 font-semibold text-gray-300">
                          : No min spend
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-400 mb-2">
                    <span className="italic">Friday & Saturday</span>
                  </div>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-center text-gray-400">
                      <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                      Sofa 10 pax{" "}
                      <span className="ml-2 font-semibold text-gray-300">
                        : 2500k
                      </span>
                    </li>
                    <li className="flex items-center text-gray-400">
                      <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                      Sofa 6 pax{" "}
                      <span className="ml-2 font-semibold text-gray-300">
                        : 1500k
                      </span>
                    </li>
                    <li className="flex items-center text-gray-400">
                      <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                      Sofa 4 pax{" "}
                      <span className="ml-2 font-semibold text-gray-300">
                        : 1000k
                      </span>
                    </li>
                    <li className="flex items-center text-gray-400">
                      <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                      Table 6 pax{" "}
                      <span className="ml-2 font-semibold text-gray-300">
                        : 750k
                      </span>
                    </li>
                    <li className="flex items-center text-gray-400">
                      <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                      Table 4 pax{" "}
                      <span className="ml-2 font-semibold text-gray-300">
                        : 500k
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </details>
        </Card>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md px-6 py-10 bg-gray-800 border-gray-700">
            <DialogHeader className="space-y-4 text-center">
              <div className="mx-auto w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                <CheckCircle className="text-amber-400" size={48} />
              </div>
              <DialogTitle className="text-2xl font-bold text-amber-400">
                Reservation Received!
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-base sm:text-lg space-y-4">
                <p>
                  Thank you for reserving at{" "}
                  <strong className="text-white">JA'AN Restaurant</strong>.
                </p>
                <p>
                  We've got your request and will reach out on WhatsApp shortly
                  to confirm.
                </p>
                <p className="font-semibold text-white">See you soon!</p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
