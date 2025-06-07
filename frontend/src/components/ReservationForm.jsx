import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function ReservationForm() {
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    pax: "",
    tableType: "",
    time: "",
    date: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const tableOptions = ["Table 4 pax", "Table 6 pax", "Sofa 6-10 pax", "Bar"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.date ||
      !form.name ||
      !form.phoneNumber ||
      !form.time ||
      !form.tableType ||
      !form.pax
    ) {
      toast.warning("Please fill in all fields.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/reservations", {
        ...form,
        date: format(form.date, "yyyy-MM-dd"),
        pax: parseInt(form.pax),
      });
      toast.success("Reservation submitted!");
      setForm({
        name: "",
        phoneNumber: "",
        pax: "",
        tableType: "",
        time: "",
        date: null,
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to submit reservation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8 mt-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">JA'AN Reservation</h2>
        <p className="text-gray-500">Book your table at JA'AN Restaurant</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="h-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="pax" className="text-sm font-medium">
              Number of Pax
            </Label>
            <Input
              type="number"
              name="pax"
              value={form.pax}
              onChange={handleChange}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time" className="text-sm font-medium">
              Time
            </Label>
            <Input
              name="time"
              value={form.time}
              onChange={handleChange}
              placeholder="e.g. 19:00"
              className="h-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="tableType" className="text-sm font-medium">
              Table Type
            </Label>
            <Select
              name="tableType"
              value={form.tableType}
              onValueChange={(value) => setForm({ ...form, tableType: value })}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select Table / Sofa" />
              </SelectTrigger>
              <SelectContent>
                {tableOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.date ? (
                    format(form.date, "PPP")
                  ) : (
                    <span>Select date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.date}
                  onSelect={(date) => setForm({ ...form, date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-base font-medium"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Reservation"}
        </Button>
      </form>

      <div className="bg-gray-50 rounded-lg p-6 space-y-3">
        <h3 className="font-semibold text-gray-900">Note minimum spend</h3>
        <ul className="space-y-2">
          <li className="flex items-center text-gray-600">
            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
            Table 4 pax: No minimum spend
          </li>
          <li className="flex items-center text-gray-600">
            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
            Table 6 pax: No minimum spend
          </li>
          <li className="flex items-center text-gray-600">
            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
            Sofa 6–10 pax: Min open 1 bottle / Min order 1500k
          </li>
          <li className="flex items-center text-gray-600">
            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
            Bar: No minimum spend
          </li>
        </ul>
      </div>
    </div>
  );
}
