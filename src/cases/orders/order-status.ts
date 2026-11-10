import type { OrderStatus } from "./dtos/order.dto";

// Para cada status da API: o rótulo em português e as cores do badge
export const ORDER_STATUSES: { value: OrderStatus; label: string; className: string }[] = [
    { value: "NEW", label: "Novo", className: "border-blue-300 bg-blue-100 text-blue-800" },
    { value: "PREPARING", label: "Em preparo", className: "border-amber-300 bg-amber-100 text-amber-800" },
    { value: "READY", label: "Pronto", className: "border-green-300 bg-green-100 text-green-800" },
    { value: "DELIVERED", label: "Entregue", className: "border-gray-300 bg-gray-100 text-gray-600" },
];

export function getOrderStatus(status: OrderStatus) {
    return ORDER_STATUSES.find((item) => item.value === status) ?? ORDER_STATUSES[0];
}
