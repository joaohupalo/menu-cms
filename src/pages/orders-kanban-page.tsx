import { useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { ListState } from "@/components/list-state";
import { KanbanCard } from "@/cases/orders/components/kanban-card";
import { KanbanColumn } from "@/cases/orders/components/kanban-column";
import { useOrders, useUpdateOrderStatus } from "@/cases/orders/hooks/use-orders";
import { ORDER_STATUSES } from "@/cases/orders/order-status";
import type { OrderStatus } from "@/cases/orders/dtos/order.dto";

export function OrdersKanbanPage() {
    const { data = [], isLoading, isError } = useOrders();
    const updateStatus = useUpdateOrderStatus();

    // Só pedidos de comandas abertas (os de comandas fechadas já foram encerrados)
    const orders = data.filter((order) => order.guestCheck.status === "OPENED");

    // Pedido que está sendo arrastado (para desenhar o DragOverlay)
    const [activeId, setActiveId] = useState<string | null>(null);
    const activeOrder = orders.find((order) => order.id === activeId);

    // O arraste só começa depois de mover 5px: assim um clique simples não vira arraste
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    function handleDragStart(event: DragStartEvent) {
        setActiveId(String(event.active.id));
    }

    // Soltou o cartão: grava o novo status na API
    function handleDragEnd(event: DragEndEvent) {
        setActiveId(null);

        const { active, over } = event;
        if (!over) return; // soltou fora de qualquer coluna

        const order = orders.find((item) => item.id === active.id);
        const newStatus = over.id as OrderStatus; // o id da coluna é o status

        if (order && order.status !== newStatus) {
            updateStatus.mutate({ id: order.id, status: newStatus });
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Pedidos</h1>
                <p className="text-sm text-muted-foreground">
                    Arraste os cartões entre as colunas para alterar o status do pedido.
                </p>
            </div>

            <ListState
                isLoading={isLoading}
                isError={isError}
                isEmpty={false} // as colunas aparecem mesmo sem pedidos
                emptyMessage=""
            />

            {!isLoading && !isError && (
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={() => setActiveId(null)}
                >
                    <div className="grid grid-cols-4 gap-4">
                        {ORDER_STATUSES.map(({ value }) => (
                            <KanbanColumn
                                key={value}
                                status={value}
                                orders={orders.filter((order) => order.status === value)}
                            />
                        ))}
                    </div>

                    {/* Cópia do cartão que acompanha o mouse por cima das colunas */}
                    <DragOverlay>
                        {activeOrder && <KanbanCard order={activeOrder} isOverlay />}
                    </DragOverlay>
                </DndContext>
            )}
        </div>
    );
}
