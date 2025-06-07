import { TableHead } from "@/components/ui/table";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function SortableHeader({
  label,
  columnKey,
  sortBy,
  sortDir,
  onSortChange,
}) {
  const handleClick = () => {
    if (sortBy === columnKey) {
      onSortChange(columnKey, sortDir === "ASC" ? "DESC" : "ASC");
    } else {
      onSortChange(columnKey, "ASC");
    }
  };

  return (
    <TableHead className="cursor-pointer select-none" onClick={handleClick}>
      <div className="flex items-center gap-1">
        {label}
        {sortBy === columnKey &&
          (sortDir === "ASC" ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          ))}
      </div>
    </TableHead>
  );
}
