// Formata um número como dinheiro brasileiro: 25.5 -> "R$ 25,50"
export function formatCurrency(value: number | string): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(Number(value)); // Number(): a API devolve o preço como texto ("25.50")
}

// Formata data e hora: "2026-11-10T12:55:34Z" -> "10/11/2026, 09:55"
export function formatDateTime(value: string): string {
    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
}

// Só a hora: "09:55"
export function formatTime(value: string): string {
    return new Intl.DateTimeFormat("pt-BR", {
        timeStyle: "short",
    }).format(new Date(value));
}
