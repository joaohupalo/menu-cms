import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ListState } from "@/components/list-state";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useOpenGuestChecks } from "@/cases/guest-checks/hooks/use-guest-checks";

export function GuestChecksPage() {
    const { data: guestChecks = [], isLoading, isError } = useOpenGuestChecks();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Comandas em aberto</h1>
                <p className="text-sm text-muted-foreground">
                    As comandas são abertas automaticamente no primeiro pedido de cada mesa.
                </p>
            </div>

            <ListState
                isLoading={isLoading}
                isError={isError}
                isEmpty={guestChecks.length === 0}
                emptyMessage="Nenhuma comanda aberta no momento."
            />

            {guestChecks.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mesa</TableHead>
                            <TableHead>Aberta em</TableHead>
                            <TableHead className="text-right">Total acumulado</TableHead>
                            <TableHead className="w-36 text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {guestChecks.map((guestCheck) => (
                            <TableRow key={guestCheck.id}>
                                <TableCell className="font-medium">{guestCheck.spot.name}</TableCell>
                                <TableCell>{formatDateTime(guestCheck.createdAt)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(guestCheck.total)}</TableCell>
                                <TableCell className="text-right">
                                    {/* Button renderizado como Link: visual de botão, navegação do React Router */}
                                    <Button variant="outline" size="sm" nativeButton={false} render={<Link to={`/comandas/${guestCheck.id}`} />}>
                                        <Eye /> Ver pedidos
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
