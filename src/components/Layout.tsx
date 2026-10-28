import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { esAdmin, normalizarRol } from "../utils/roles";
import { Avatar } from "./Avatar";
import { PerfilModal } from "./PerfilModal";

// Estructura del Dashboard: barra superior + contenido + modal de perfil
export function Layout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);

  if (!user) return null;

  const tab = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
    }`;

  function salir() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <span className="text-lg font-extrabold tracking-tight text-brand-600">FunVal Shop</span>

          <nav className="flex gap-1">
            <NavLink to="/dashboard" className={tab}>Dashboard</NavLink>
            {/* La pestaña Usuarios SOLO existe para el admin */}
            {esAdmin(user.role) && <NavLink to="/usuarios" className={tab}>Usuarios</NavLink>}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <button onClick={() => setModalAbierto(true)} className="flex items-center gap-2 rounded-full pr-2 hover:bg-slate-100" title="Editar perfil">
              <Avatar src={user.avatar_url} nombre={user.name} size="sm" />
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-sm font-semibold">{user.name}</span>
                <span className="block text-xs capitalize text-slate-500">{normalizarRol(user.role)}</span>
              </span>
            </button>
            <button onClick={salir} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100">
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Le pasamos a las páginas la función para abrir el modal */}
        <Outlet context={{ abrirPerfil: () => setModalAbierto(true) }} />
      </main>

      {modalAbierto && <PerfilModal onClose={() => setModalAbierto(false)} />}
    </div>
  );
}

export interface LayoutContext {
  abrirPerfil: () => void;
}
