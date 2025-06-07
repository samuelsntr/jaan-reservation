import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
} from "date-fns";

export default function QuickDateSelect({ onRangeChange, className = "w-40" }) {
  const handleChange = (val) => {
    const today = new Date();
    if (val === "thisWeek") {
      onRangeChange(startOfWeek(today), endOfWeek(today));
    } else if (val === "thisMonth") {
      onRangeChange(startOfMonth(today), endOfMonth(today));
    } else if (val === "last7") {
      onRangeChange(subDays(today, 7), today);
    }
  };

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Quick Date" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="thisWeek">This Week</SelectItem>
        <SelectItem value="thisMonth">This Month</SelectItem>
        <SelectItem value="last7">Last 7 Days</SelectItem>
      </SelectContent>
    </Select>
  );
}
