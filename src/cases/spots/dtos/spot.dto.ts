// Formato da mesa que a API devolve
export interface SpotDTO {
    id: string;
    name: string;
    active: boolean;
}

// Dados que o formulário envia para cadastrar/editar
export interface SpotFormDTO {
    name: string;
    active: boolean;
}
