import { NavLink, Outlet } from "react-router-dom"
import { ClipboardList, LayoutGrid, MapPin, UtensilsCrossed } from "lucide-react"
import { cn } from "cn"
import logomarca from "@/assets/logomarca.svg"

// Itens do menu lateral: caminho da rota, texto e ícone
const menuItems = [
  { to: "/comandas", label: "Comandas", icon: ClipboardList },
  { to: "/categorias", label: "Categorias", icon: LayoutGrid },
  { to: "/produtos", label: "Produtos", icon: UtensilsCrossed },
  { to: "/mesas", label: "Mesas", icon: MapPin },
]

export function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r bg-card p-4">
        <img src={logomarca} className="mb-6 w-40" />

        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Aqui o React Router desenha a página da rota atual */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
