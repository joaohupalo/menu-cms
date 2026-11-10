import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatTime } from "@/lib/format";
import { useUpdateOrderStatus } from "../hooks/use-orders";
import { ORDER_STATUSES } from "../order-status";
import { OrderStatusBadge } from "./order-status-badge";
import type { OrderDTO, OrderStatus } from "../dtos/order.dto";

// Itens do select de status (rótulo em português)
const statusItems = ORDER_STATUSES.map(({ value, label }) => ({ value, label }));

interface OrderCardProps {
    order: OrderDTO;
    number: number; // posição do pedido na comanda (Pedido 1, 2, 3...)
}

export function OrderCard({ order, number }: OrderCardProps) {
    const updateStatus = useUpdateOrderStatus();

    function handleStatusChange(status: OrderStatus | null) {
        if (!status || status === order.status) return;
        updateStatus.mutate({ id: order.id, status });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    Pedido {number}
                    <span className="text-sm font-normal text-muted-foreground">às {formatTime(order.createdAt)}</span>
                    <OrderStatusBadge status={order.status} />
                </CardTitle>
                <CardAction>
                    {/* As transições são livres: qualquer status pode ir para qualquer outro */}
                    <Select items={statusItems} value={order.status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-40" disabled={updateStatus.isPending}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {statusItems.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead className="text-right">Qtd.</TableHead>
                            <TableHead className="text-right">Preço unit.</TableHead>
                            <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.product.name}</TableCell>
                                <TableCell className="text-right">{item.quantity}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>Total do pedido</TableCell>
                            <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardContent>
        </Card>
    );
}
