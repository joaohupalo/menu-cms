import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api-error";
import { OrderService } from "../services/order.service";
import { getOrderStatus } from "../order-status";
import type { OrderDTO, OrderStatus } from "../dtos/order.dto";

const QUERY_KEY = ["orders"];

// LEITURA: pedidos de uma comanda (ou todos, se não passar a comanda)
export function useOrders(guestCheckId?: string) {
    return useQuery({
        queryKey: [...QUERY_KEY, guestCheckId ?? "all"],
        queryFn: () => OrderService.listAll(guestCheckId),
        refetchInterval: 15_000, // novos pedidos chegam pelo cardápio
    });
}

// ALTERAÇÃO DE STATUS (usada no select do detalhe da comanda e no Kanban)
export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
            OrderService.updateStatus(id, status),

        // ATUALIZAÇÃO OTIMISTA: muda o status no cache ANTES da resposta da API.
        // No Kanban, o cartão fica na coluna nova na hora em que é solto,
        // em vez de voltar para a coluna antiga e "pular" quando a API responder.
        onMutate: async ({ id, status }) => {
            // Cancela buscas em andamento, para não sobrescreverem a mudança
            await queryClient.cancelQueries({ queryKey: QUERY_KEY });

            // Guarda uma cópia de todas as listas de pedidos, para desfazer se der erro
            const previous = queryClient.getQueriesData<OrderDTO[]>({ queryKey: QUERY_KEY });

            // Troca o status do pedido em todas as listas do cache
            queryClient.setQueriesData<OrderDTO[]>({ queryKey: QUERY_KEY }, (orders) =>
                orders?.map((order) => (order.id === id ? { ...order, status } : order))
            );

            return { previous };
        },

        onSuccess: (_order, { status }) => {
            toast.success(`Pedido marcado como "${getOrderStatus(status).label}".`);
        },

        onError: (error, _variables, context) => {
            // Deu erro na API: devolve as listas como estavam antes
            context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
            toast.error(getErrorMessage(error));
        },

        // Com sucesso ou erro, busca de novo para ficar igual ao banco
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}
