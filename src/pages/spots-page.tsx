import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { ListState } from "@/components/list-state";
import { SpotFormDialog } from "@/cases/spots/components/spot-form-dialog";
import { useDeleteSpot, useSpots } from "@/cases/spots/hooks/use-spots";
import type { SpotDTO } from "@/cases/spots/dtos/spot.dto";

export function SpotsPage() {
    const { data: spots = [], isLoading, isError } = useSpots();
    const deleteSpot = useDeleteSpot();

    // Controle dos diálogos
    const [formOpen, setFormOpen] = useState(false);
    const [editingSpot, setEditingSpot] = useState<SpotDTO | null>(null);
    const [deletingSpot, setDeletingSpot] = useState<SpotDTO | null>(null);

    function openCreate() {
        setEditingSpot(null);
        setFormOpen(true);
    }

    function openEdit(spot: SpotDTO) {
        setEditingSpot(spot);
        setFormOpen(true);
    }

    function confirmDelete() {
        if (!deletingSpot) return;
        deleteSpot.mutate(deletingSpot.id, {
            onSettled: () => setDeletingSpot(null), // fecha o diálogo com sucesso ou erro
        });
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Mesas</h1>
                <Button onClick={openCreate}>
                    <Plus /> Nova mesa
                </Button>
            </div>

            <ListState
                isLoading={isLoading}
                isError={isError}
                isEmpty={spots.length === 0}
                emptyMessage="Nenhuma mesa cadastrada."
            />

            {spots.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Situação</TableHead>
                            <TableHead className="w-28 text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {spots.map((spot) => (
                            <TableRow key={spot.id}>
                                <TableCell className="font-medium">{spot.name}</TableCell>
                                <TableCell>
                                    <Badge variant={spot.active ? "default" : "secondary"}>
                                        {spot.active ? "Ativa" : "Inativa"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon-sm" title="Editar" onClick={() => openEdit(spot)}>
                                        <Pencil />
                                    </Button>
                                    <Button variant="ghost" size="icon-sm" title="Excluir" onClick={() => setDeletingSpot(spot)}>
                                        <Trash2 className="text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Só monta o formulário quando está aberto: assim ele sempre começa
                com os dados certos (vazio no cadastro, preenchido na edição) */}
            {formOpen && (
                <SpotFormDialog
                    open={formOpen}
                    onOpenChange={setFormOpen}
                    spot={editingSpot}
                />
            )}

            <ConfirmDeleteDialog
                open={!!deletingSpot}
                onOpenChange={(open) => !open && setDeletingSpot(null)}
                itemName={`a mesa "${deletingSpot?.name}"`}
                onConfirm={confirmDelete}
                isDeleting={deleteSpot.isPending}
            />
        </div>
    );
}
