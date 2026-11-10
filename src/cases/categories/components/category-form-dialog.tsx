import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateCategory, useUpdateCategory } from "../hooks/use-categories";
import { CATEGORY_ICONS } from "./category-icons";
import type { CategoryDTO } from "../dtos/category.dto";

interface CategoryFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: CategoryDTO | null; // preenchido = EDIÇÃO
}

// Itens do select de ícone: o "label" é o que aparece na tela
const iconItems = [
    { value: null, label: "Sem ícone" },
    ...CATEGORY_ICONS.map(({ value, label, icon: Icon }) => ({
        value,
        label: (
            <span className="flex items-center gap-2">
                <Icon className="size-4" /> {label}
            </span>
        ),
    })),
];

export function CategoryFormDialog({ open, onOpenChange, category }: CategoryFormDialogProps) {
    const isEditing = !!category;

    const [name, setName] = useState(category?.name ?? "");
    const [icon, setIcon] = useState<string | null>(category?.icon ?? null);
    // Guardado como texto porque vem de um <input>; convertido para número ao salvar
    const [displayOrder, setDisplayOrder] = useState(String(category?.displayOrder ?? 0));
    const [active, setActive] = useState(category?.active ?? true);
    const [errors, setErrors] = useState<{ name?: string; displayOrder?: string }>({});

    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();
    const isSaving = createCategory.isPending || updateCategory.isPending;

    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        // Validação antes de enviar para a API
        const order = Number(displayOrder);
        const newErrors: typeof errors = {};

        if (!name.trim()) {
            newErrors.name = "Informe o nome da categoria.";
        }
        if (displayOrder === "" || !Number.isInteger(order) || order < 0) {
            newErrors.displayOrder = "A ordem deve ser um número inteiro (0 ou maior).";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const data = { name: name.trim(), icon, displayOrder: order, active };
        const options = { onSuccess: () => onOpenChange(false) };

        if (isEditing) {
            updateCategory.mutate({ id: category.id, data }, options);
        } else {
            createCategory.mutate(data, options);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit} noValidate className="grid gap-4">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Editar categoria" : "Nova categoria"}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-2">
                        <Label htmlFor="category-name">Nome *</Label>
                        <Input
                            id="category-name"
                            value={name}
                            maxLength={60}
                            placeholder="Ex.: Lanches"
                            onChange={(event) => setName(event.target.value)}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Ícone</Label>
                            <Select items={iconItems} value={icon} onValueChange={setIcon}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {iconItems.map((item) => (
                                        <SelectItem key={item.value ?? "none"} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category-order">Ordem de exibição *</Label>
                            <Input
                                id="category-order"
                                type="number"
                                min={0}
                                step={1}
                                value={displayOrder}
                                onChange={(event) => setDisplayOrder(event.target.value)}
                            />
                            {errors.displayOrder && <p className="text-sm text-destructive">{errors.displayOrder}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Switch id="category-active" checked={active} onCheckedChange={setActive} />
                        <Label htmlFor="category-active">Ativa</Label>
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
