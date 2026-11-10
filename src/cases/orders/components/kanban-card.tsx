import { useDraggable } from "@dnd-kit/core";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatTime } from "@/lib/format";
import type { OrderDTO } from "../dtos/order.dto";

interface KanbanCardProps {
    order: OrderDTO;
    isOverlay?: boolean; // true = cópia que segue o mouse durante o arraste
}

// Conteúdo do cartão: mesa, horário, itens e total
export function KanbanCard({ order, isOverlay }: KanbanCardProps) {
    return (
        <Card size="sm" className={isOverlay ? "rotate-2 shadow-lg ring-2 ring-primary" : ""}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    {order.guestCheck.spot.name}
                    <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                        <Clock className="size-3" /> {formatTime(order.createdAt)}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
                {order.items.map((item) => (
                    <div key={item.id}>
                        <span className="font-medium">{item.quantity}x</span> {item.product.name}
                    </div>
                ))}
                <div className="pt-1 text-right font-medium">{formatCurrency(order.total)}</div>
            </CardContent>
        </Card>
    );
}

// Versão "arrastável" do cartão
export function DraggableKanbanCard({ order }: { order: OrderDTO }) {
    // useDraggable registra o cartão no DndContext.
    // O id é o id do pedido: no onDragEnd sabemos QUAL pedido foi movido.
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: order.id });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            // Enquanto arrasta, o original fica apagado; quem segue o mouse é o DragOverlay
            className={`cursor-grab touch-none active:cursor-grabbing ${isDragging ? "opacity-30" : ""}`}
        >
            <KanbanCard order={order} />
        </div>
    );
}
