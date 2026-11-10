import type { SpotDTO } from "@/cases/spots/dtos/spot.dto";

// Mesmos valores do enum OrderStatus do backend
export type OrderStatus = "NEW" | "PREPARING" | "READY" | "DELIVERED";

export interface OrderItemDTO {
    id: string;
    quantity: number;
    price: string;      // preço unitário no momento do pedido ("25.50")
    subtotal: string;   // quantidade x preço
    product: {
        id: string;
        name: string;
    };
}

export interface OrderDTO {
    id: string;
    createdAt: string;
    status: OrderStatus;
    total: string;
    items: OrderItemDTO[];
    guestCheck: {
        id: string;
        createdAt: string;
        status: "OPENED" | "CLOSED";
        spot: SpotDTO;
    };
}
