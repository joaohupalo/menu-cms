import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { ListState } from "@/components/list-state";
import { CategoryFormDialog } from "@/cases/categories/components/category-form-dialog";
import { CategoryIcon } from "@/cases/categories/components/category-icon";
import { useCategories, useDeleteCategory } from "@/cases/categories/hooks/use-categories";
import type { CategoryDTO } from "@/cases/categories/dtos/category.dto";

export function CategoriesPage() {
    const { data: categories = [], isLoading, isError } = useCategories();
    const deleteCategory = useDeleteCategory();

    const [formOpen, setFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryDTO | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<CategoryDTO | null>(null);

    function openCreate() {
        setEditingCategory(null);
        setFormOpen(true);
    }

    function openEdit(category: CategoryDTO) {
        setEditingCategory(category);
        setFormOpen(true);
    }

    function confirmDelete() {
        if (!deletingCategory) return;
        deleteCategory.mutate(deletingCategory.id, {
            onSettled: () => setDeletingCategory(null),
        });
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Categorias</h1>
                <Button onClick={openCreate}>
                    <Plus /> Nova categoria
                </Button>
            </div>

            <ListState
                isLoading={isLoading}
                isError={isError}
                isEmpty={categories.length === 0}
                emptyMessage="Nenhuma categoria cadastrada."
            />

            {categories.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-20">Ordem</TableHead>
                            <TableHead className="w-20">Ícone</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Situação</TableHead>
                            <TableHead className="w-28 text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.displayOrder}</TableCell>
                                <TableCell>
                                    <CategoryIcon name={category.icon} className="size-5 text-brand" />
                                </TableCell>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell>
                                    <Badge variant={category.active ? "default" : "secondary"}>
                                        {category.active ? "Ativa" : "Inativa"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon-sm" title="Editar" onClick={() => openEdit(category)}>
                                        <Pencil />
                                    </Button>
                                    <Button variant="ghost" size="icon-sm" title="Excluir" onClick={() => setDeletingCategory(category)}>
                                        <Trash2 className="text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {formOpen && (
                <CategoryFormDialog
                    open={formOpen}
                    onOpenChange={setFormOpen}
                    category={editingCategory}
                />
            )}

            <ConfirmDeleteDialog
                open={!!deletingCategory}
                onOpenChange={(open) => !open && setDeletingCategory(null)}
                itemName={`a categoria "${deletingCategory?.name}"`}
                onConfirm={confirmDelete}
                isDeleting={deleteCategory.isPending}
            />
        </div>
    );
}
