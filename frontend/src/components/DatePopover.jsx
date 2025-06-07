import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { formatDate } from "../lib/formatDate";

export default function DatePopover({
  label,
  date,
  onChange,
  placeholder = "Select date",
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`justify-start w-34 ${date ? "md:w-auto" : "md:w-34"}`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDate(date) : label || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Calendar
          mode="single"
          selected={date ? formatDate(date) : undefined}
          onSelect={(selectedDate) =>
            onChange(selectedDate ? formatDate(selectedDate) : null)
          }
        />
      </PopoverContent>
    </Popover>
  );
}
