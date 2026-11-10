import { Navigate, Route, Routes } from "react-router-dom"
import { AppLayout } from "./components/layout/app-layout"
import { CategoriesPage } from "./pages/categories-page"
import { ProductsPage } from "./pages/products-page"
import { SpotsPage } from "./pages/spots-page"
import { GuestChecksPage } from "./pages/guest-checks-page"
import { GuestCheckDetailPage } from "./pages/guest-check-detail-page"

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/comandas" replace />} />
        <Route path="/categorias" element={<CategoriesPage />} />
        <Route path="/produtos" element={<ProductsPage />} />
        <Route path="/mesas" element={<SpotsPage />} />
        <Route path="/comandas" element={<GuestChecksPage />} />
        <Route path="/comandas/:id" element={<GuestCheckDetailPage />} />
      </Route>
    </Routes>
  )
}

export default App
