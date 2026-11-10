import { useQuery } from "@tanstack/react-query";
import { GuestCheckService } from "../services/guest-check.service";

// Comandas não são criadas nem editadas pelo CMS (o backend abre no primeiro pedido),
// então aqui só existem leituras: useQuery, sem useMutation.

// Os pedidos chegam pelo cardápio (menu-frontend) a qualquer momento.
// refetchInterval faz o TanStack Query buscar de novo a cada 15 segundos.
const REFRESH_MS = 15_000;

export function useOpenGuestChecks() {
    return useQuery({
        queryKey: ["guest-checks", "opened"],
        queryFn: GuestCheckService.listOpened,
        refetchInterval: REFRESH_MS,
    });
}

export function useGuestCheck(id: string) {
    return useQuery({
        queryKey: ["guest-checks", id],
        queryFn: () => GuestCheckService.findOne(id),
        refetchInterval: REFRESH_MS,
    });
}
