import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/cases/categories/hooks/use-categories";
import { useCreateProduct, useUpdateProduct } from "../hooks/use-products";
import type { ProductDTO } from "../dtos/product.dto";

interface ProductFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: ProductDTO | null; // preenchido = EDIÇÃO
}

type FormErrors = { name?: string; price?: string; picture?: string };

export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
    const isEditing = !!product;

    // As opções do select de categoria vêm da API
    const { data: categories = [], isLoading: loadingCategories } = useCategories();
    const categoryItems = [
        { value: null, label: "Sem categoria" },
        ...categories.map((category) => ({ value: category.id, label: category.name })),
    ];

    const [name, setName] = useState(product?.name ?? "");
    const [description, setDescription] = useState(product?.description ?? "");
    // Texto, para aceitar vírgula: "25,50". Convertido para número ao salvar.
    const [price, setPrice] = useState(product ? String(Number(product.price)).replace(".", ",") : "");
    const [picture, setPicture] = useState(product?.picture ?? "");
    const [categoryId, setCategoryId] = useState<string | null>(product?.category?.id ?? null);
    const [active, setActive] = useState(product?.active ?? true);
    const [vegetarian, setVegetarian] = useState(product?.vegetarian ?? false);
    const [isNew, setIsNew] = useState(product?.isNew ?? false);
    const [errors, setErrors] = useState<FormErrors>({});

    const createProduct = useCreateProduct();
    const updateProduct = useUpdateProduct();
    const isSaving = createProduct.isPending || updateProduct.isPending;

    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        // Validação antes de enviar para a API
        const priceNumber = Number(price.replace(",", "."));
        const newErrors: FormErrors = {};

        if (!name.trim()) {
            newErrors.name = "Informe o nome do produto.";
        }
        if (!price.trim() || Number.isNaN(priceNumber) || priceNumber <= 0) {
            newErrors.price = "Informe um preço maior que zero.";
        } else if (!/^\d+([.,]\d{1,2})?$/.test(price.trim())) {
            newErrors.price = "Use no máximo 2 casas decimais (ex.: 25,90).";
        }
        if (picture.trim() && !/^https?:\/\/.+/.test(picture.trim())) {
            newErrors.picture = "A imagem deve ser uma URL começando com http:// ou https://";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const data = {
            name: name.trim(),
            description: description.trim() || null, // texto vazio vira null
            price: priceNumber,
            picture: picture.trim() || null,
            categoryId,
            active,
            vegetarian,
            isNew,
        };
        const options = { onSuccess: () => onOpenChange(false) };

        if (isEditing) {
            updateProduct.mutate({ id: product.id, data }, options);
        } else {
            createProduct.mutate(data, options);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit} noValidate className="grid gap-4">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Editar produto" : "Novo produto"}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-2">
                        <Label htmlFor="product-name">Nome *</Label>
                        <Input
                            id="product-name"
                            value={name}
                            maxLength={60}
                            placeholder="Ex.: X-Salada"
                            onChange={(event) => setName(event.target.value)}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="product-description">Descrição</Label>
                        <Textarea
                            id="product-description"
                            value={description}
                            placeholder="Ingredientes, tamanho..."
                            onChange={(event) => setDescription(event.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="product-price">Preço (R$) *</Label>
                            <Input
                                id="product-price"
                                inputMode="decimal"
                                value={price}
                                placeholder="0,00"
                                onChange={(event) => setPrice(event.target.value)}
                            />
                            {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label>Categoria</Label>
                            <Select items={categoryItems} value={categoryId} onValueChange={setCategoryId}>
                                <SelectTrigger className="w-full" disabled={loadingCategories}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryItems.map((item) => (
                                        <SelectItem key={item.value ?? "none"} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="product-picture">URL da imagem</Label>
                        <Input
                            id="product-picture"
                            value={picture}
                            placeholder="https://..."
                            onChange={(event) => setPicture(event.target.value)}
                        />
                        {errors.picture && <p className="text-sm text-destructive">{errors.picture}</p>}
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-3">
                            <Switch id="product-active" checked={active} onCheckedChange={setActive} />
                            <Label htmlFor="product-active">Ativo</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch id="product-vegetarian" checked={vegetarian} onCheckedChange={setVegetarian} />
                            <Label htmlFor="product-vegetarian">Vegetariano</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch id="product-new" checked={isNew} onCheckedChange={setIsNew} />
                            <Label htmlFor="product-new">Novidade</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Salvando..." : "Salvar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
