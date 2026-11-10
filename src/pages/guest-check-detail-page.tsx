import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListState } from "@/components/list-state";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useGuestCheck } from "@/cases/guest-checks/hooks/use-guest-checks";
import { OrderCard } from "@/cases/orders/components/order-card";
import { useOrders } from "@/cases/orders/hooks/use-orders";

export function GuestCheckDetailPage() {
    // O id vem da URL: /comandas/:id
    const { id = "" } = useParams();

    const guestCheck = useGuestCheck(id);
    const orders = useOrders(id);
    const orderList = orders.data ?? [];

    return (
        <div className="space-y-6">
            <Button variant="ghost" size="sm" nativeButton={false} render={<Link to="/comandas" />}>
                <ArrowLeft /> Voltar para comandas
            </Button>

            <ListState
                isLoading={guestCheck.isLoading}
                isError={guestCheck.isError}
                isEmpty={false}
                emptyMessage=""
            />

            {guestCheck.data && (
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Comanda — {guestCheck.data.spot.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Aberta em {formatDateTime(guestCheck.data.createdAt)}
                        </p>
                    </div>
                    <div className="text-right">
                        <Badge variant={guestCheck.data.status === "OPENED" ? "default" : "secondary"}>
                            {guestCheck.data.status === "OPENED" ? "Aberta" : "Fechada"}
                        </Badge>
                        <p className="mt-1 text-xl font-semibold">{formatCurrency(guestCheck.data.total)}</p>
                    </div>
                </div>
            )}

            {guestCheck.data && (
                <>
                    <ListState
                        isLoading={orders.isLoading}
                        isError={orders.isError}
                        isEmpty={orderList.length === 0}
                        emptyMessage="Esta comanda ainda não tem pedidos."
                    />

                    <div className="grid gap-4">
                        {orderList.map((order, index) => (
                            <OrderCard key={order.id} order={order} number={index + 1} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
