import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api-error";
import { ProductService } from "../services/product.service";
import type { ProductFormDTO } from "../dtos/product.dto";

const QUERY_KEY = ["products"];

// LEITURA (com filtro opcional por categoria).
// A categoria entra na chave: cada filtro tem seu próprio cache,
// e ao trocar o filtro o TanStack Query busca de novo automaticamente.
export function useProducts(categoryId?: string | null) {
    return useQuery({
        queryKey: [...QUERY_KEY, categoryId ?? "all"],
        queryFn: () => ProductService.listAll(categoryId),
    });
}

// CADASTRO
export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ProductFormDTO) => ProductService.create(data),
        onSuccess: () => {
            // ["products"] invalida TODAS as listas: ["products","all"], ["products", "<id>"]...
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            toast.success("Produto cadastrado!");
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}

// EDIÇÃO
export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ProductFormDTO }) =>
            ProductService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            toast.success("Produto atualizado!");
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}

// EXCLUSÃO
export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ProductService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            toast.success("Produto excluído!");
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    });
}
