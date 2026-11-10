import { api } from "@/lib/axios";
import type { SpotDTO, SpotFormDTO } from "../dtos/spot.dto";

const ENDPOINT = "/spots";

export const SpotService = {
    async listAll(): Promise<SpotDTO[]> {
        const result = await api.get<SpotDTO[]>(ENDPOINT);
        return result.data;
    },

    async create(data: SpotFormDTO): Promise<SpotDTO> {
        const result = await api.post<SpotDTO>(ENDPOINT, data);
        return result.data;
    },

    async update(id: string, data: SpotFormDTO): Promise<SpotDTO> {
        const result = await api.patch<SpotDTO>(`${ENDPOINT}/${id}`, data);
        return result.data;
    },

    async remove(id: string): Promise<void> {
        await api.delete(`${ENDPOINT}/${id}`);
    },
};
