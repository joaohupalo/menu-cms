import { useDroppable } from "@dnd-kit/core";
import { OrderStatusBadge } from "./order-status-badge";
import { DraggableKanbanCard } from "./kanban-card";
import type { OrderDTO, OrderStatus } from "../dtos/order.dto";

interface KanbanColumnProps {
    status: OrderStatus;
    orders: OrderDTO[];
}

export function KanbanColumn({ status, orders }: KanbanColumnProps) {
    // useDroppable transforma a coluna numa área onde dá para soltar cartões.
    // O id é o status: no onDragEnd, "over.id" diz para qual status o pedido vai.
    const { setNodeRef, isOver } = useDroppable({ id: status });

    return (
        <div
            ref={setNodeRef}
            className={`flex min-h-96 flex-col gap-3 rounded-xl border p-3 transition-colors ${
                isOver ? "border-primary bg-primary/10" : "bg-muted/40"
            }`}
        >
            <div className="flex items-center justify-between">
                <OrderStatusBadge status={status} />
                <span className="text-sm text-muted-foreground">{orders.length}</span>
            </div>

            {orders.map((order) => (
                <DraggableKanbanCard key={order.id} order={order} />
            ))}

            {orders.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">Nenhum pedido</p>
            )}
        </div>
    );
}
