import type { SpotDTO } from "@/cases/spots/dtos/spot.dto";

export type GuestCheckStatus = "OPENED" | "CLOSED";

// Comanda como a API devolve em GET /guest-checks e GET /guest-checks/:id
export interface GuestCheckDTO {
    id: string;
    createdAt: string;   // data de abertura
    status: GuestCheckStatus;
    spot: SpotDTO;       // mesa vinculada
    total: number;       // soma dos pedidos (calculada no backend)
}
