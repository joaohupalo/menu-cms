import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ProductPictureProps {
    src: string | null;
    alt: string;
}

// Miniatura do produto. Se não tiver imagem, ou se a URL estiver quebrada, mostra um ícone.
export function ProductPicture({ src, alt }: ProductPictureProps) {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <div className="flex size-12 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <ImageOff className="size-5" />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className="size-12 rounded-md object-cover"
            onError={() => setFailed(true)}
        />
    );
}
