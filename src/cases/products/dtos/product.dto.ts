import type { CategoryDTO } from "@/cases/categories/dtos/category.dto";

// Formato do produto que a API devolve
export interface ProductDTO {
    id: string;
    name: string;
    description: string | null;
    price: string;              // o Postgres devolve "numeric" como texto: "25.50"
    picture: string | null;     // URL da imagem
    active: boolean;
    vegetarian: boolean;
    isNew: boolean;
    category: CategoryDTO | null;
}

// Dados que o formulário envia para cadastrar/editar
export interface ProductFormDTO {
    name: string;
    description: string | null;
    price: number;
    picture: string | null;
    categoryId: string | null;
    active: boolean;
    vegetarian: boolean;
    isNew: boolean;
}
