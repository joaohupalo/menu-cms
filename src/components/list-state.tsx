import { AlertCircle, Inbox, Loader2 } from "lucide-react";

interface ListStateProps {
    isLoading: boolean;
    isError: boolean;
    isEmpty: boolean;
    emptyMessage: string;
}

// Mostra "carregando", "erro" ou "lista vazia".
// Devolve null quando há dados, e aí a página mostra a lista normalmente.
export function ListState({ isLoading, isError, isEmpty, emptyMessage }: ListStateProps) {
    if (isLoading) {
        return (
            <div className="flex items-center gap-2 py-10 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" /> Carregando...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center gap-2 py-10 text-destructive">
                <AlertCircle className="size-5" /> Não foi possível carregar os dados. Verifique se a API está rodando.
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="flex items-center gap-2 py-10 text-muted-foreground">
                <Inbox className="size-5" /> {emptyMessage}
            </div>
        );
    }

    return null;
}
