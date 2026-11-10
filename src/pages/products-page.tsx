import { useState } from "react";
import { Leaf, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { ListState } from "@/components/list-state";
import { formatCurrency } from "@/lib/format";
import { useCategories } from "@/cases/categories/hooks/use-categories";
import { ProductFormDialog } from "@/cases/products/components/product-form-dialog";
import { ProductPicture } from "@/cases/products/components/product-picture";
import { useDeleteProduct, useProducts } from "@/cases/products/hooks/use-products";
import type { ProductDTO } from "@/cases/products/dtos/product.dto";

export function ProductsPage() {
    // Filtro: null = todas as categorias
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

    const { data: products = [], isLoading, isError } = useProducts(categoryFilter);
    const { data: categories = [] } = useCategories();
    const deleteProduct = useDeleteProduct();

    const filterItems = [
        { value: null, label: "Todas as categorias" },
        ...categories.map((category) => ({ value: category.id, label: category.name })),
    ];

    const [formOpen, setFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<ProductDTO | null>(null);

    function openCreate() {
        setEditingProduct(null);
        setFormOpen(true);
    }

    function openEdit(product: ProductDTO) {
        setEditingProduct(product);
        setFormOpen(true);
    }

    function confirmDelete() {
        if (!deletingProduct) return;
        deleteProduct.mutate(deletingProduct.id, {
            onSettled: () => setDeletingProduct(null),
        });
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Produtos</h1>
                <Button onClick={openCreate}>
                    <Plus /> Novo produto
                </Button>
            </div>

            <div className="w-64">
                <Select items={filterItems} value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {filterItems.map((item) => (
                            <SelectItem key={item.value ?? "all"} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <ListState
                isLoading={isLoading}
                isError={isError}
                isEmpty={products.length === 0}
                emptyMessage={categoryFilter ? "Nenhum produto nesta categoria." : "Nenhum produto cadastrado."}
            />

            {products.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">Imagem</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Indicadores</TableHead>
                            <TableHead>Situação</TableHead>
                            <TableHead className="w-28 text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <ProductPicture src={product.picture} alt={product.name} />
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{product.name}</div>
                                    {product.description && (
                                        <div className="max-w-xs truncate text-xs text-muted-foreground">
                                            {product.description}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {product.category?.name ?? <span className="text-muted-foreground">Sem categoria</span>}
                                </TableCell>
                                <TableCell>{formatCurrency(product.price)}</TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        {product.vegetarian && (
                                            <Badge variant="outline" className="border-green-600 text-green-700">
                                                <Leaf /> Vegetariano
                                            </Badge>
                                        )}
                                        {product.isNew && (
                                            <Badge variant="outline" className="border-amber-500 text-amber-700">
                                                <Sparkles /> Novidade
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={product.active ? "default" : "secondary"}>
                                        {product.active ? "Ativo" : "Inativo"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon-sm" title="Editar" onClick={() => openEdit(product)}>
                                        <Pencil />
                                    </Button>
                                    <Button variant="ghost" size="icon-sm" title="Excluir" onClick={() => setDeletingProduct(product)}>
                                        <Trash2 className="text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {formOpen && (
                <ProductFormDialog
                    open={formOpen}
                    onOpenChange={setFormOpen}
                    product={editingProduct}
                />
            )}

            <ConfirmDeleteDialog
                open={!!deletingProduct}
                onOpenChange={(open) => !open && setDeletingProduct(null)}
                itemName={`o produto "${deletingProduct?.name}"`}
                onConfirm={confirmDelete}
                isDeleting={deleteProduct.isPending}
            />
        </div>
    );
}
