import type { Money } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function Price({ min, max, className }: { min: Money; max?: Money; className?: string }) {
  const hasRange = max && max.amount !== min.amount;
  return (
    <p className={className}>
      {hasRange && "Desde "}
      {formatPrice(min)}
    </p>
  );
}
