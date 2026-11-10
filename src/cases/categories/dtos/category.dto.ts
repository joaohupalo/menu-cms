// Formato da categoria que a API devolve
export interface CategoryDTO {
    id: string;
    name: string;
    icon: string | null;
    displayOrder: number;
    active: boolean;
}

// Dados que o formulário envia para cadastrar/editar
export interface CategoryFormDTO {
    name: string;
    icon: string | null;
    displayOrder: number;
    active: boolean;
}
