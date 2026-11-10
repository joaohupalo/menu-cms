import { api } from "@/lib/axios";
import type { CategoryDTO, CategoryFormDTO } from "../dtos/category.dto";

const ENDPOINT = "/categories";

export const CategoryService = {
    async listAll(): Promise<CategoryDTO[]> {
        const result = await api.get<CategoryDTO[]>(ENDPOINT);
        return result.data;
    },

    async create(data: CategoryFormDTO): Promise<CategoryDTO> {
        const result = await api.post<CategoryDTO>(ENDPOINT, data);
        return result.data;
    },

    async update(id: string, data: CategoryFormDTO): Promise<CategoryDTO> {
        const result = await api.patch<CategoryDTO>(`${ENDPOINT}/${id}`, data);
        return result.data;
    },

    async remove(id: string): Promise<void> {
        await api.delete(`${ENDPOINT}/${id}`);
    },
};
