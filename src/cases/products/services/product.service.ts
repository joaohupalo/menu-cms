import { api } from "@/lib/axios";
import type { ProductDTO, ProductFormDTO } from "../dtos/product.dto";

const ENDPOINT = "/products";

export const ProductService = {
    // Se receber categoryId, a API devolve só os produtos daquela categoria
    async listAll(categoryId?: string | null): Promise<ProductDTO[]> {
        const result = await api.get<ProductDTO[]>(ENDPOINT, {
            params: categoryId ? { categoryId } : {}, // vira ?categoryId=... na URL
        });
        return result.data;
    },

    async create(data: ProductFormDTO): Promise<ProductDTO> {
        const result = await api.post<ProductDTO>(ENDPOINT, data);
        return result.data;
    },

    async update(id: string, data: ProductFormDTO): Promise<ProductDTO> {
        const result = await api.patch<ProductDTO>(`${ENDPOINT}/${id}`, data);
        return result.data;
    },

    async remove(id: string): Promise<void> {
        await api.delete(`${ENDPOINT}/${id}`);
    },
};
