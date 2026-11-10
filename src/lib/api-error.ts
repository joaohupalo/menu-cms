import { isAxiosError } from "axios";

// Extrai uma mensagem legível do erro devolvido pela API (NestJS).
// O Nest manda { message: "texto" } ou { message: ["erro 1", "erro 2"] }.
export function getErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
            return message.join(", ");
        }

        if (typeof message === "string") {
            return message;
        }

        return "Não foi possível conectar à API.";
    }

    return "Erro inesperado.";
}
