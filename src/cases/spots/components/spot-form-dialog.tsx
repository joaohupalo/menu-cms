import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCreateSpot, useUpdateSpot } from "../hooks/use-spots";
import type { SpotDTO } from "../dtos/spot.dto";

interface SpotFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    spot?: SpotDTO | null; // se vier preenchido, o formulário é de EDIÇÃO
}

export function SpotFormDialog({ open, onOpenChange, spot }: SpotFormDialogProps) {
    const isEditing = !!spot;

    // Estado dos campos, começando com os dados da mesa (edição) ou vazio (cadastro)
    const [name, setName] = useState(spot?.name ?? "");
    const [active, setActive] = useState(spot?.active ?? true);
    const [error, setError] = useState("");

    const createSpot = useCreateSpot();
    const updateSpot = useUpdateSpot();
    const isSaving = createSpot.isPending || updateSpot.isPending;

    function handleSubmit(event: FormEvent) {
        event.preventDefault(); // impede o navegador de recarregar a página

        // Validação antes de enviar para a API
        if (!name.trim()) {
            setError("Informe o nome da mesa.");
            return;
        }

        const data = { name: name.trim(), active };
        const options = { onSuccess: () => onOpenChange(false) }; // fecha o diálogo se deu certo

        if (isEditing) {
            updateSpot.mutate({ id: spot.id, data }, options);
        } else {
            createSpot.mutate(data, options);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit} noValidate className="grid gap-4">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Editar mesa" : "Nova mesa"}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-2">
                        <Label htmlFor="spot-name">Nome *</Label>
                        <Input
                            id="spot-name"
                            value={name}
                            maxLength={60}
                            placeholder="Ex.: Mesa 01"
                            onChange={(event) => {
                                setName(event.target.value);
                                setError("");
                            }}
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>

                    <div className="flex items-center gap-3">
                        <Switch id="spot-active" checked={active} onCheckedChange={setActive} />
                        <Label htmlFor="spot-active">Ativa</Label>
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
