import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatDate";

export default function DateRangeBadges({
  startDate,
  endDate,
  className = "mb-4",
}) {
  if (!startDate && !endDate) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {startDate && (
        <Badge variant="outline">From: {formatDate(startDate)}</Badge>
      )}
      {endDate && <Badge variant="outline">To: {formatDate(endDate)}</Badge>}
    </div>
  );
}
