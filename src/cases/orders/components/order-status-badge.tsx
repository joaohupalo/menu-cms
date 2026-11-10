import { Badge } from "@/components/ui/badge";
import { getOrderStatus } from "../order-status";
import type { OrderStatus } from "../dtos/order.dto";

// Badge com uma cor diferente para cada status
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
    const { label, className } = getOrderStatus(status);

    return (
        <Badge variant="outline" className={className}>
            {label}
        </Badge>
    );
}
