import { api } from "@/lib/axios";
import type { OrderDTO, OrderStatus } from "../dtos/order.dto";

const ENDPOINT = "/orders";

export const OrderService = {
    // GET /orders?guestCheckId=... -> pedidos de uma comanda (sem filtro: todos)
    async listAll(guestCheckId?: string): Promise<OrderDTO[]> {
        const result = await api.get<OrderDTO[]>(ENDPOINT, {
            params: guestCheckId ? { guestCheckId } : {},
        });
        return result.data;
    },

    // PATCH /orders/:id/status
    async updateStatus(id: string, status: OrderStatus): Promise<OrderDTO> {
        const result = await api.patch<OrderDTO>(`${ENDPOINT}/${id}/status`, { status });
        return result.data;
    },
};
