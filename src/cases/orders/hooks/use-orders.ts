import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api-error";
import { OrderService } from "../services/order.service";
import { getOrderStatus } from "../order-status";
import type { OrderStatus } from "../dtos/order.dto";

const QUERY_KEY = ["orders"];

// LEITURA: pedidos de uma comanda (ou todos, se não passar a comanda)
export function useOrders(guestCheckId?: string) {
    return useQuery({
        queryKey: [...QUERY_KEY, guestCheckId ?? "all"],
        queryFn: () => OrderService.listAll(guestCheckId),
        refetchInterval: 15_000, // novos pedidos chegam pelo cardápio
    });
}

// ALTERAÇÃO DE STATUS
export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
            OrderService.updateStatus(id, status),
        onSuccess: (_order, { status }) => {
            // Atualiza todas as listas de pedidos (detalhe da comanda e Kanban)
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            toast.success(`Pedido marcado como "${getOrderStatus(status).label}".`);
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
