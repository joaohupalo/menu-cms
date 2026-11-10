import { Utensils } from "lucide-react";
import { CATEGORY_ICONS } from "./category-icons";

interface CategoryIconProps {
    name: string | null;
    className?: string;
}

// Desenha o ícone a partir do nome salvo na API.
// Se a categoria não tiver ícone (ou o nome não existir na lista), usa os talheres.
export function CategoryIcon({ name, className }: CategoryIconProps) {
    const Icon = CATEGORY_ICONS.find((item) => item.value === name)?.icon ?? Utensils;
    return <Icon className={className} />;
}
