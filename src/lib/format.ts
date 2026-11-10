// Formata um número como dinheiro brasileiro: 25.5 -> "R$ 25,50"
export function formatCurrency(value: number | string): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(Number(value)); // Number(): a API devolve o preço como texto ("25.50")
}
